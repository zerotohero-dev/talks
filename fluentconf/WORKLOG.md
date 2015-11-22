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

And here are the results:

```bash
Results:
    Concurrency    Throughput      Latency
        1          1201.15         0.833          967
        2          1904.75         1.050
        3          1998.10         1.501
        4          2129.52         1.878          1662
        5          2077.49         2.407
        6          2032.66         2.952
        7          2188.85         3.198
        8          2150.26         3.720
        9          2122.07         4.241
       10          2176.24         4.595
       11          2152.25         5.111
       12          2134.06         5.623
       13          2153.59         6.036
       14          2166.22         6.463
       15          2145.68         6.991
       52          2166.44        24.003
      102          2183.61        46.712
      202          2218.48        91.053
      402          2182.78       184.169       1890
      802          2144.95       373.901
     1602          2129.14       752.418
     2602          2078.87      1251.643
     4602          2046.52      1912.302
     8602          1977.86      4349.153
    10602          1890.20      5608.919
    12000          1895.76      6329.908
    15000          1760.36      8520.974
    17000           951.01     17875.695
```

And here are some charts for visual people:

// TODO: Discuss findings
Understanding your api's response time requires an understanding of the relationship between concurrency, throughput, and latency. Your service does not possess infinite throughput potential: It achieves its maximum throughput at a certain concurrency level. Beyond this point (*a.k.a., the throughput saturation point*) throughput remains constant in **well-architected** applications. — The response time, however, begins to increase.

At higher concurrency levels, even a slight decrease in throughput will cause a super-linear increase in latency.

// TODO: insert charts.

// TODO: explain what's happenning.

## **Step 002**: Benchmarking a Plain Node.JS HTTP Server

// TODO: implement. make sure you do the benchmark on a reliable network.
