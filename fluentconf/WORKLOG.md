Note that this is in draft mode.

I’ll write ad-hoc notes here and clean them up later.

I’ll be keeping a log of what I did, and the results of the tests and benchmarks I ran in this file. Because, you know, anything can happen during a live coding session, and I want some data to point at and say "If that thing worked, here's how it’d have looked like" in case $#!% happens :)

## How to Debug a Running System

Although this is kind of out of scope of the talk I'd better add some pointers here:

Running node with `--abort-on-uncaught-exception` for instance will generate a core dump when $#!% happens; and then you can analyse the core with tools like mdb, dtrace and the like.

TODO: provide additional links here.

## Methodology

I’m using [apachebench][ab] for benchmarking the sample setups; and it’s a **good enough** tool for our demo purposes.

Here’s roughly the steps I follow before each `ab` test:

* Before each test, I restart the server(s).
* I run something like ` ab -n 100000 -c 100 http://SERVER_IP:SERVER_PORT/SERVICE`
* I don't use *connection reuse* (*i.e., `-k`*) mode because that I wanted to keep things simpler.
* I run the tests 5 times and pick the average of the middle theree results.
* After each test, I wait for ~10 seconds.

> **Note**
>
> Not using the `-k` option will be better representation of a geographically distributed load; as when you initiate connections from different locations, you cannot reuse them.
>
> Using `-k` option will not change the general trend of the results, it will just produce higher concurrency numbers with similar latency characteristics.
>
> Additionally, leaving the `-k` option out creates smoother graphs that are prettier to present **;)**.
>
> [apachebench][ab] can only give a general idea, and that's **good enough** for our needs. If you want a more in depth analysis, however, you would want a fully featured load testing tool such as [jmeter][jmeter].

That said, for an actual production setup, it would make more sense to conduct a distributed API load test, using an "as a service" solution [such as flood.io][flood].

## **Step 001**: Benchmarking a Simple Restify App

TODO: before that, commit the current state of the containers to their corresponding images.
TODO: repeat the test: limit bastion to 2 cores, and use a separate core for the service.
TODO: make sure that you are not running anything else on your system while you're running your benchmarks.

Here's what I ran:

```bash
ab -n 100000 -c "${CONCURRENCY}" http://${HOST}:8080/hello
```

// TODO: repeat the tests with wifi turned off. + disconnected from other
monitors + on battery power.

And here are the results:

```bash
Results:
    Concurrency    Throughput       Latency
        1           1835.83           0.545
        2           3360.43           0.595
        4           3565.52           1.122
        8           3719.80           2.151
       10           3737.10           2.676
       40           3932.26          10.172
      100           3778.13          26.468
      200           3763.73          53.139
      400           3754.15         106.549
      800           3638.04         219.898
     1000           3617.27         276.452
     2000           3637.83         549.779
     4000           3487.68        1146.895
     8000           2849.90        3508.900
    10000           2672.45        3741.887
    16000           2690.55        5946.746
    20000           2078.49        9622.386
```

And here are some charts for visual people:

// TODO: insert images.

// TODO: Discuss findings
Understanding your api's response time requires an understanding of the relationship between concurrency, throughput, and latency. Your service does not possess infinite throughput potential: It achieves its maximum throughput at a certain concurrency level (*or **user load**, depending on how you look at it*). Beyond this point (*a.k.a., the throughput saturation point*) throughput remains constant in **well-architected** applications. — The response time, however, begins to increase.

At higher concurrency levels, even a slight decrease in throughput will cause a super-linear increase in latency.

// TODO: insert charts.

// TODO: explain what's happenning.

## **Step 002**: Benchmarking a Plain Node.JS HTTP Server

I'll take a level of concurrency that I know that I've saturated throughput
and do two other measurements, one for a plain Node.js HTTP server, and one for
a plain node.js socket app.

// TODO: implement. make sure you do the benchmark on a reliable network.

## **Step 003**: A Simple Demo API

Our demo API "infers" what a webpage is about by reading the contents of the page, creating a text-only representation, and then doing some natural language analysis on that text only representation.

Here's a sample request:

```
curl -X "POST" "http://192.168.99.100:8003/api/v1/graph" \
	-H "Content-Type: application/graphql" \
	-d $'{

    tags(url: "http://192.168.99.100:8080/10-tricks-to-appear-smart-during-meetings-27b489a39d1a.html")
}'
```

Which gets this reponse:

```
{
    "data": {
        "tags": [
            "business",
            "deep contemplative sigh",
            "envious quick math",
            "favorite tricks",
            "good catch-all question",
            "humor",
            "inaccurate better marker",
            "matter",
            "meetings",
            "notes",
            "smart afraid step",
            "smart meetings",
            "tech"
        ]
    }
}
```

The demo API has two endpoints

* **tags**: Given a URL, infer what the URL is all about (*i.e., create "tags" about it*).
* **urls**: Check what URLs a particular tag has been related to so far.

To easily do an `ab` test, I've also created two endpoints `/benchmark/get-urls` and `/benchmark/get-tags`

When I run `ab -n 10 -c 2 http://172.17.0.5:8003/benchmark/get-urls` I get around 800 requests per second; which is *not that bad* when considering we are doing some graphql magic, and the app is running on a development docker box.

When I run `ab -n 10 -c 2 http://172.17.0.5:8003/benchmark/get-tags` however, I get **less than two requests per second**, which clearly indicates something is wrong.

And here's the fun part:

I can run two `ab -n 1000 -c 200 http://172.17.0.5:8003/benchmark/get-urls` benchmarks, side by side, and get around 900 requests per second each; however when I run a `ab -n 10 -c 2 http://172.17.0.5:8003/benchmark/get-urls` and `ab -n 10 -c 2 http://172.17.0.5:8003/benchmark/get-tags` side by side the performance of `get-urls` goes down to 5 requests per second.

Plus the CPU utilization drastically increases when we call `get-tags`, whereas it is almost zero when we call `get-urls`

So we have two issues here:

* get-tags appears to be CPU-bound (*which is a bad thing*)
* get-tags appears to be really slow
* get-tags appears to block other API requests.

So we have a hyphothesis; the next thing is to gather further evidence to validate our hyphothesis. Which means we need to **monitor** our demo instance.

And when it comes to monitoring, there's this "observer's effect"; i.e., we affect the system that we monitor by the fact that we are monitoring it. — We'd like to keep this effect to a minimum.

There are a bunch of important metrics to watch

* Event Loop Delay
* Garbage Collection
* CPU Utilization (it’s unusual for a Node.JS app to be CPU-bound)
* Heap Usage over Time
* API
    * Response Time
    * Error Rates (error totals, error categories)

There are a lot of services that does that for you; and in production it makes much more sense to use those services than to cook your own
( TODO:// list those )
What those services basically do is to install agents, or probes on your application or on your system, and regularly report aggragated metrics and measurements back to a collection endpoint.

We'll be creating a "much simpler" monitoring system for the sake of this demo. — Again, this is not aimed for production use; it's just for demonstrating concepts behind monitoring and instrumentation. You'd be **much** better off using a "monitoring as a service" solution instead.

For probes I was planning to use `dtrace`, and as it turned out, `dtrace` as its current state does not compile on a debian docker container. So I'll pick the closest alternative: `jstrace`

## Adding Monitoring

// TODO: explain what monitoring tools you used.

## Diagnosing the App

When it comes to trying to see what’s wrong with your app, quality of your data
triumps quantity.

And there are certain approaches and patterns that can be helful:

* Expose your app’s state globally through a REPL.
* Have good logging practices.
* Create machine-consumable logs (with lots of keys to query).
* Take a heap dump whenever the app crashes. — Every crash is important.
* Know your app’s inflection points and create alarms and autoscale rules.
* Create an API that switches your app into a “diagnostic mode”, increasing log levels etc, without restarting it.
* Use circuit breakers so that when you app/microservice is down, it does not impact the performance of the rest of the system.
* Utilize post-mortem debugging tools, and keep in mind that post-mortem debugging and live debugging require two different mindsets.

## Extracting the CPU-intensive part

After instrumenting our app live, we’ve figured out that there are CPU-intensive tasks that are blocking the event loop.

At that point, a temporary solution could be to fork a child process and manage the CPU intensive task on a separate core.

That’s just an interim solution though. Becuase, probably your Node.JS virtual machine has been optimized for IO and network utilization. — For CPU-intensive tasks you might consider using a specialized virtual machine for that purpose. Additionally, separating the concerns will help you scale them out individually which will give flexibily and resilience to your architecture.

That’s what we’ll do next.
