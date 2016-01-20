## About

> **Note**
>
> I’m constantly adding bits and pieces here, and updating the code in this folder **almost daily**.
>
> Stay tuned.

This is the repository for [O’Reilly FluentConf 2016 **Scaling Your *Node.JS* API Like a Boss**][talk] talk. 

Along with the source code, you’ll also see other useful nuggets, and reference material. This repository also contains code and information that have not been covered in the talk (*due to scope and/or time limitations*).

Enjoy!

rabbitMQ Management Console URL: http://192.168.99.100:15672/ user:guest pass:guest

vantage app:8003
vantage compute:8003
vantage app:8004
vantage compute:8004

webmin: https://192.168.99.100:10000/

* <https://s3.amazonaws.com/nodejsrocks/fluent_app.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_app_1.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_app_2.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_bastion.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_compute.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_compute_1.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_compute_2.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_demo.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_dns.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_http.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_load_balancer.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_rabbit.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_redis_app.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_redis_compute.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_restify.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_sinopia.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_tcp.tar>
* <https://s3.amazonaws.com/nodejsrocks/fluent_web.tar>


## Directory Structure

Here’s a brief outline of how this project is organized:

* **bin**: Contains runner scripts for various scenarios
* **containers**: Contains source code for various containers. Note that these folders are **numbered**. Each number represents the next step in the application’s development. You can think of these as `git tag`s.
* **containers/bastion**: This is the entry container that we use to access and/or benchmark other containers.
* **meta**: Contains random data to be sorted.
* **assets**: Mostly contains images to be used in the presentation.

## Environment Setup

In case you’d like to try the examples yourself, you have some prep work to do.

### Host Machine

The demos use **[docker][docker]** containers on a *MacBook Pro (Late 2013), 2.4 GHz Intel Core i5, 16 GB 1600 MHz DDR3 memory, solid state drive, OS X El Capitan Version 10.11.x*.

If you are using a different operating system, then your setup might be different.

### Container Preparation

First let’s make sure that the host machine does not have any network or file handler limitations:

```bash
user@Macbook:/#

sysctl kern.maxfiles=65536
kern.maxfiles: 524288

sudo sysctl -w kern.maxfilesperproc=65000
kern.maxfilesperproc: 524288

sysctl kern.ipc.somaxconn=60000
maxconn: 40000

ulimit -n
524288
```

These numbers are **good enough** for our demo purposes.

The docker containers that I’ll be using in this demo are **Ubuntu 14.04.3 LTS**.

When I do an `ulimit -a`, I get the following:

```bash
core file size          (blocks, -c) 0
data seg size           (kbytes, -d) unlimited
scheduling priority             (-e) 0
file size               (blocks, -f) unlimited
pending signals                 (-i) 7898
max locked memory       (kbytes, -l) 64
max memory size         (kbytes, -m) unlimited
open files                      (-n) 1048576
pipe size            (512 bytes, -p) 8
POSIX message queues     (bytes, -q) 819200
real-time priority              (-r) 0
stack size              (kbytes, -s) 8192
cpu time               (seconds, -t) unlimited
max user processes              (-u) 1048576
virtual memory          (kbytes, -v) unlimited
file locks                      (-x) unlimited
```

This is also **good enough** for our demo purposes.

You’ll especially want **high** `open files` and `max user processes` numbers.

If they are not high enough, consider raising them with `ulimit -w`

You may also want to modify the local ephemeral port ranges on the containers:

```bash
root@container:/#
# The default range is "32768 61000" and it's "suficcent" for our purposes.
# Increasing the range a bit won't hurt though:
sysctl -w net.ipv4.ip_local_port_range="1024 65000"
```

There’s only one remainingproblem to be adjusted:

The containers have `128` maximum socket connections by default. And this is not enough for highly-concurrent load testing. 

To modify this limit the containers need to be run in [privileged mode][docker-run]. Then we’ll have to run the following code whenever a container launches:

```bash
root@container:/#
sysctl -w net.core.somaxconn=32768
```

One dirty hack would be to put this code into `/etc/bash.bashrc`. This is suboptimal, and it saves the day nonetheless.

> **Note**
>
> In a production setup the **somaxconn** you need will depend on your concurrency needs. If you have a gaming service with tens of thousands of realtime concurrent users that constantly keep an open socket connection, then a high number would be necessary. 
>
> In such a realtime app, you might go as high as a few tens of thousands; however, most probably your virtual machine will start to break somewhere around 5K to 10K concurrent connections; and you’ll need to autoscale after that point anyway.
>
> In a typical API service that will face highly concurrent load, this setting generally falls somewhere between **1204** and **2048**.

## Running the Demos

You’ll need the docker containers that I’m using to be able to use `setup-cluster` and `stop-cluster` commands that reside inside the `bin` folder. — I’ll find a way/place to distribute them. — Stay tuned.

TODO: publicly distribute the docker images.

## Appendix

### About the `ab` Tool

During certain parts of the demo we use the [`ab`][ab] tool to measure the application throughput.

There are, however, some problems with ab to be aware of:

Firstly, `ab` will **flood** the server as fast as it can generate the requests. It has no option to delay between the requests.

Given that the network layer is essentially bypassed (*i.e., because of proximity we can assume zero network delay for all practical purposes*). `ab` will create a peak level of requests that will eventually saturate the resources.

Moreover, expect the behavior of the `ab` tests to be increasingly non-deterministic under higher concurrent loads.

> **Aside**
> 
> In the current few tests the number of requests (`-n`) is set up high to observe the maximum throughput of the system. 
> 
> In a production benchmark, using `ab` with lower `-n` and `-c` values (*like `-n == 400, -c == 10`) and then slowly increasing the values would provide much valuable insights into the system.
> As a rule of thumb, when you increase `-c`, consider lowering `-n`.
>
> Even with relatively low values like `-c == 10` and `-n == 500` you can get pretty intuitive results.
>
> **Do not increment the limits too much**.

Again, when opening large number of connections, `ab` test might turn out to be non-deterministic unreliable due to ephemeral port exhaustion. In that case, waiting for ~4 minutes, and restarting the containers will help stabilize things.

If you need really high concurrency, then you'd better use a distributed load testing setup (*like a cluster of AWS instance in different zones, or a distributed load teesting "as a service" solution*).

One last thing is `ab` is an **HTTP/1.0** client; i.e., it’s not an HTTP/1.1 client, therefore what you test with `ab` will **not** represent how your API behaves in the wild.

### Thinks To Watch For When Running an `ab` Test

Before running your `ab` tests, make sure that:

* Nothing else is consuming network resources (*there are no downloads, no browser tabs open*).
* There is no CPU-intensive activity (*such as a scheduled background task*).
* You restart the service before each test.
* If there’s anything suspicious, wait for 4 minutes to avoid ephemeral port exhaustion, and try again.
* Repeat tests five times, eliminate the top and bottom ones, and use the average of the remaining three.

### **Load Testing** versus **Stress Testing**

A **load test** is usually conducted to understand the behavior of the system under a specific expected load; whereas a **stress test** is a test to understand the upper capacity limits of a system, it measures the system's robustness under extreme load.

### Running Tests From Multiple Geolocations

Running a geographically spread test is important because it’s the closest way to mimic actual end usage pattern. 

Besides, when you start assuming non-zero network delay, **concurrency** and **throughput** metrics start to become much more meaningful. — Additionally, this kind of test will be benchmarking your entire architecture as a whole (*i.e., your caching layer, your load balancer, etc.*), and in the end of the day, that **is** what matters. 

Nobody cares how cool your architecture is; the only thing the users care about is how **fast** and how **reliable** your APIs are.

### Load Testing and Benchmarking Tools and Services

Here are certain tools and services that you can evaluate. This is, by no means a conclusive list.

* <https://blazemeter.com>
* <http://smartbear.com/>
* <http://jmeter.apache.org/>
* TODO:// add more.

### Show Me The Results

[The **Worklog**](WORKLOG.MD) contains a log of setups that I've created with progressively increasing complexity, and benchmark tests related to them.

### Show Me The Deck

// TODO: link to slide deck.

### License

**MIT** License

[See the License file for details](LICENSE.md).


[talk]: http://conferences.oreilly.com/fluent/javascript-html-us/public/schedule/detail/46028 "Scaling Your Node.JS API Like a Boss" 
[docker]: https://www.docker.com "Docker: Build, Ship, Run"
[docker-run]: https://docs.docker.com/engine/reference/run/ "Docker: `run` command."
[ab]: https://httpd.apache.org/docs/2.2/programs/ab.html
