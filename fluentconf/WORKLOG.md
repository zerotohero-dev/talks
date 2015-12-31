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

> *Note*
> 
> Make sure that you are not running anything else on your system while you’re running your benchmarks.

> *Note*
>
> The test environments should be as identical as possible.
>
> The system should **not** be on battery power because Mac OS does crazy cpu deoptimizations to save battery when not connected to the power cord. And those optimizations are non-deterministic (to my observation), which can lead in having significantly different results when you run the same test with the same parameters repeatedly. 

Here's what I ran:

```bash
ab -n 100000 -c "${CONCURRENCY}" http://${HOST}:8080/hello
```

Here are the results:

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

// TODO: discuss findings

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

## The Compute Service

I don’t want to call it a “micro” service because the term has been abused to death so far **:)**.

Here’s what we did in the `005-demo-split-compute` iteration:

* We’ve split the CPU-heavy “compute” part of the service from the IO-bound API service part.
* We’ve put a **message bus** between these two services to enable **loose coupling** between the services.
* We’ve added an **in-memory cache** so that we don’t need to do computations if we don’t have to.

## About Service Discovery

When the number of applications and services inside the application start exceeding a handful, then dynamically managing them starts exponentially harder.

One of such management problems is "dynamic routing" and "dynamic service discovery".

In a production setup you’d normally use something like **dynamic DNS** or a discovery service like [Consul][consul] (*which is “kind of” a DNS anyway :)*) to discover resources. For the sake of this demo, however, using `docker --link` would be sufficient.

One advantage of using `docker --link` is that it dynamically configures the `/etc/hosts` file of the containers, so you don’t have to hardcode IP addresses in your app. — Hardcoding IP addresses is a one-way ticket to hell; you should be using discovery services and dynamic DNS resolution all the time.

Next is, making logging a bit better.

## Configuring the Logging

> Good developers debug, great developers read logs.

Actually, before configuring the logging I’ll setup some container networking. As the number of containers that I manage increases, so does the complexity in managing them.

Docker, by design, isolates each container from one another. You cannot assign private static IP addresses to containers. And actually that’s a good thing: It forces you rethink your architecture. 

> Any source file that has hard-coded IP addresses in it will eventually become a operational maintenance nightmare. Use DNS and discovery services instead.

In a production setup, I would be using something like [consul][consul] for the discovery service, or use a DNS server. For our demo, though, both of these are overkill. I’ll use `docker link` instead.

The next is configuring log rotation. 

It’s relatively easy in debian-based systems:

```bash
sudo apt-get install logrotate
```

/etc/logrotate.d/fluent

```
/var/log/fluent/service.log {
    monthly
    size 100M
    rotate 12
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}
```

Then create an entry at `/etc/logrotate.d/`. 

In this demo, however, we’re using docker containers, therefore `logrotate` will not start by default. One way to overcome that is to expose the log folder to the host machine and use the host machine’s `logrotate` process. — Since this exposes the contents of the container, this might be a security leak though.

Binding a volume to the container and write your logs from your process to that mount point  maps a location in the container’s file system to a location on the host. You can then access the logs separately from the running process in your container and use tools like logrotate to handle them.

Another alternative is to push the logs to a cloud log aggregator over the network.

## What Happens When Node Breaks?

In the last section:

* We have created machine-consumable logs so that we can have something like ELK ingest and process them later.
* We also looked at different ways to deal with log files.

Next up, is managing the node process.

## What if the Node Process Crashes?

Instead of running the apps as a service, we will manually bootstrap them using forever

Creating an init script or a upstart script and running `forever` in it will enable running `forever` as a service.

TODO: list services like forever.

So now we’re running…

```bash
docker exec -d fluent_compute forever /opt/fluent
docker exec -d fluent_app forever /opt/fluent
```

… and that monitors the compute and app services and restarts them upon crashes.

A slightly more advanced one would be 

```bash
docker exec -d fluent_compute forever /usr/bin/node /opt/fluent 
docker exec -d fluent_app forever /usr/bin/node /opt/fluent
```

Where `--abort-on-uncaught-exception` will tell node to take a core dump

## What About Memory Leaks?

Memory management in modern operating systems is very complicated, and there is no simple answer to "how much memory is my process using?".

We can do several things.

* Programmatically take core dumps ( https://www.npmjs.com/package/core-dump )
* Take ad-hoc core dumps ( gcore )
* Take core dumps at `--abort-on-uncaught-exception`

These will give valuable data, you can visualize them, diff them, count object in them to detect memory leaks.

Similarly we can.

* Programmatically take heap snapshots (when your "monitoring" thingy suspects memory leaks)
* Take a heap snapshot just before the app crashes (can help you root-cause problems, and it’s relatively easier to analyze than a core file)

Next up, we’ll deal with these things which will make our app vigilant and robust enough so that we can talk about scaling it.

So, to diagnose and monitor our virtual containers:

* We’ve established good logging practices.
* We’ve aggregated our log files for later analysis.
* We’ve made important global state easily accessible.
* We’ve put probes in the code to trace important events.
* We’ve taken statistical samples of the stack trace.
* We’ve dumped core files and taken heap snapshots on an ad-hoc basis.
* We’ve dumped core files and taken heap snapshots on app crashes.
* We’ve dumped core files and taken heap snapshot whenever we suspect a memory leak.


Summary so far: We are measuring performance, handling crashes, and closely tracking memory leaks, and also looking into other metrics like the “event loop delay”. 

We also kept timers on how long each request took: If a requests takes particularly longer, we can drill down further and add more probes to see what’s taking so long. — Soon, we’ll see a way to do this without disrupting the operation (*i.e. hot swapping*).

All of these are critical for the operation, and auto-scalability of a production system.

These should be **good enough** for hardening our individual virtual container, and now we can talk about horizontal scaling.

## Exposing the Garbage Collector (*for diagnostic purposes*)

TODO: talk about diagnosing gc behavior ( --expose-gc and its friends )

node --expose_gc --trace-gc --trace_gc_verbose --gc_global .

--v8-options | grep gc

## Other Tools

You can statistically sample stack traces (*[using linux perf events]*), and then use a [flame chart] to visualize and analyze them. 

While doing that if you use `--perf_basic_prof_only_functions` (*new in Node 5*) your flame graph data will make much more sense.

(`--perf_basic_prof_only_functions` outputs a map file that translates native memory addresses to actual javascript files and their line numbers)

Your **core dump** contains a canonical representation of your app’s state; therefore you can do your post-mortem debugging anywhere you like.

To analyze core dumps your best bet is to use a solaris instance dedicated to that or use an “as a service” solution (*such as Manta*)

Another hint would be **name your functions**, especially event-handling functions and callbacks. And also **do not nest functions within scopes**. You’ll thank me later **:)**.

v8 runtime is most of the time intelligent enough to infer function names; yet sometimes you will need to give the anonymous functions names (*i.e., make them “named” functions*) to get a better and more useful stack trace.

By extension, naming your functions will help you analyze them better in the flame graphs.
Named function expressions is the only way to get a truly robust stack inspection.

Fat arrows are cool; however, naming your functions will give valuable hints to the post-mortem analysis tools that you’ll use. So don’t hesitate to give your globally-accessed 

Nesting functions will make your code, arguably, harder to read. And more important than that, nested functions, if not used carefully, can create very-difficult-to-diagnose memory leak problems.

Also `gcore`: takes the core dump of a process w/o interrupting it.

Post-mortem debugging is a “must have” for any production system. It gives so much state information that it’s virtually impossible to attain the same depth and breath of information by simply analyzing aggregated log files.

## «« Your Jedi mind tricks don’t work on me »»

Keep in mind that your “gut feeling” does not work in production. 99% of the time, the root cause of the problem will be diagonally different thant what you initially have suspected. So always use a scientific methodology:

* Form a hypothesis.
* Gather evidence.
* Review your hypothesis in the light of the evidence.
* Improve your hypothesis or form a new hypothesis.
* Rinse an repeat until you find the root cause.
                        
That’s the only true way to root-cause a problem; or fix a performance issue as fast as possible, with as little code change and regressions as possible.

Next up? Horizontal scaling.

## Creating a Private npm

After developing your apps for a while you’ll realize that there are common code that you can reuse between modules.

The proper way to reuse them is through npm registries.

For that you can either use a private npm as a cloud, or you can use your own private npm registry.

Using a private npm has several advantages:

TODO: list them.



## Clustering Our App
