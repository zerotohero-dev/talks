Note that this is in draft mode.

I'll write ad-hoc notes here and clean them up later.

I'll be keeping a log of what I did, and the results of the tests and benchmarks I ran in this file. Because, you know, anything can happen during a live coding session, and I want some data to point at and say "If that thing worked, here's how it'd have looked like" in case $#!% happens :)

## Methodology

I'm using [apachebench][ab] for benchmarking the sample setups; and it's a **good enough** tool for our demo purposes.

Here's roughly the steps I follow before each `ab` test:

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

That said. for an actual production setup, it would make more sense to conduct a distributed API load test, using an "as a service" solution [such as flood.io][flood].

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
