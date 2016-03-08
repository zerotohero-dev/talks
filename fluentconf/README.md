## About

This is the folder for [O’Reilly FluentConf 2016 **Scaling Your *Node.JS* API Like a Boss**][talk] talk. 

This folder includes both the source code that we’ll be using, and also some supporting material and useful nuggets that are worth looking at.

## Show Me The Slides

[You Can View the Auidience Copy of the Slides Here](https://speakerdeck.com/volkan/scaling-your-node-dot-js-api-like-a-boss). **Audience copy** means that the slides contain **more** material than that is covered in the talk; provoding additional links to review, and introducing additional concepts. — It’s, kind of, like the **uncut version** of the talk.

## Development Setup


If you want to run the code in your own development environment, then you’ll need some prep-work to do.

Note that the development setup will take an hour or so (*at least, depending on how lucky you are with Murphy's Laws **:)** *). Thus, if you want to be ready before the talk begins, give yourself plenty of time to set up your stuff.

### Installing Required Software

For Windows and Mac, you’ll need to install:

* [Virtualbox](https://www.virtualbox.org/wiki/Downloads)
* [Docker Toolbox](https://www.docker.com/docker-toolbox)
* and [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)


> **Note**
>
> We will be using [Webstorm][webstorm] for certain tasks like **remote debugging**, [you can download a free 30 day trial here][webstorm].

For Linux, you’ll need to install **Docker** and **git**.

> **Note**
>
> I’ll be using a Macbook for the demos; however, your setup might slightly vary for **Windows** and **Linux**.

### Getting the Environment Snapshots

I’m storing the recent snapshots of the environment on AWS Cloud. Follow these links to fetch them first:

* **Container Tarballs**: <https://s3.amazonaws.com/nodejsrocks/docker-tars.zip> 
* **Project Source Code**: <https://s3.amazonaws.com/nodejsrocks/fluentconf.zip>

Expand `fluentconf.zip` and `docker-tars.zip` inside the same folder.

### Pulling Third-Party Docker Images

Execute this script to import the required third-party images into Docker:

> **Note** (*for Mac and Windows*)
> 
> Before running the below commands, you’ll need to launch the **Docker Quickstart Terminal**.
>
> This will make sure that the `docker` executable is available and the docker Virtualbox virtual machine is up and running.
 
```bash
echo "Importing third-party containers first."
docker pull sameersbn/bind
echo "Imported bind."
docker pull redis
echo "Imported redis."
docker pull rnbwd/sinopia
echo "Imported sinopia."
docker pull rabbitmq
docker pull rabbitmq:3-management
echo "Imported rabbitmq."
```

### Importing Project Docker Images

Then execute this script inside the `docker-tars` folder to import the project images:


```bash
echo "Importing demo containers…"
cat fluent_app.tar | docker import - fluent:service-app
echo "Imported fluent:service-app."
cat fluent_bastion.tar | docker import - fluent:bastion
echo "Imported fluent:bastion."
cat fluent_compute.tar | docker import - fluent:service-compute
echo "Imported fluent:service-compute."
cat fluent_demo.tar | docker import - fluent:service-demo
echo "Imported fluent:service-demo."
cat fluent_http.tar | docker import - fluent:service-http
echo "Imported fluent:service-http."
cat fluent_load_balancer.tar | docker import - fluent:service-load-balancer
echo "Imported fluent:service-load-balancer."
cat fluent_restify.tar | docker import - fluent:service-restify
echo "Imported fluent:service-restify."
cat fluent_tcp.tar | docker import - fluent:service-tcp
echo "Imported fluent:service-tcp."
cat fluent_web.tar | docker import - fluent:service-static-server
echo "Imported fluent:service-static-server."
echo "All Done!"
```

If everything goes well, when you do a `docker images`, you should see something like this:

```text
REPOSITORY          TAG                    …
fluent              service-static-server  …
fluent              service-tcp            …
fluent              service-restify        …
fluent              service-load-balancer  …
fluent              service-http           …
fluent              service-demo           …
fluent              service-compute        …
fluent              bastion                …
fluent              service-app            …
rabbitmq            3-management           …
rabbitmq            latest                 …
sameersbn/bind      latest                 …
redis               latest                 …
rnbwd/sinopia       latest                 …
```

### Running Sample Apps

The `fluentconf` folder has a `bin` folder inside it that has useful script.

To run the first app for instance:

* Make sure that `docker` is up and running
* Go to the `fluentconf` folder.
* Execute `./bin/000/setup-cluster.sh`
* Then execute `./bin/000/start-cluster.sh`

To stop the app:

* Execute `./bin/000/stop-cluster.sh`

### Some Useful URLs

* RabbitMQ Management Console: http://{DOCKER_IP}:15672/
* DNS Webmin: https://{DOCKER_IP}:10000/

Also I use the following `alias` to launch `docker` on Mac.

```bash
alias dock='/usr/bin/env bash '\'/Applications/Docker/\
Docker Quickstart Terminal.app\
/Contents/Resources/Scripts/start.sh'\''
```

…

That’s all you need to run the samples.

Enjoy!

### A Little More Details

If you want to run the benchmarks given in the talk as accurate as possible, then you might want to tweak your system further.

First let’s make sure that the host machine does not have any network or file handler limitations:

> **Note**
>
> I am running the following commands in a Unix-like operating system; if you are using a different operating system then your commands will likely vary.

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

When I do an `ulimit -a` inside those containers, I get the following:

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
# The default range is "32768 61000" and it’s “sufficient” for our purposes.
# Increasing the range a bit won’t hurt though:
sysctl -w net.ipv4.ip_local_port_range="1024 65000"
```

There’s only one remaining problem to be adjusted:

The containers have `128` maximum socket connections by default. And this is not enough for highly-concurrent load testing. 

To modify this limit the containers need to be run in [privileged mode][docker-run]. Then we’ll have to run the following code whenever a container launches:

```bash
root@container:/#
sysctl -w net.core.somaxconn=32768
```

One dirty hack would be to put this code into `/etc/bash.bashrc`. This is suboptimal, yet it saves the day nonetheless.

> **Note**
>
> In a production setup the `somaxconn` you need will depend on your concurrency needs. If you have a gaming service with tens of thousands of realtime concurrent users that constantly keep an open socket connection, then a high number would be necessary. 
>
> In such a realtime app, you might go as high as a few tens of thousands; however, most probably your virtual machine will start to break somewhere around 5K to 10K concurrent connections; and you’ll need to autoscale after that point anyway.
>
> In a typical API service that will face highly concurrent load, this setting generally falls somewhere between **1204** and **2048**.

## Project Directory Structure

Here’s a brief outline of how this project is organized:

* **bin**: Contains runner scripts for various scenarios
* **containers**: Contains source code for various containers. Note that these folders are **numbered**. Each number represents the next step in the application’s development. You can think of these as `git tag`s.
* **containers/bastion**: This is the entry container that we use to access and/or benchmark other containers.
* Additionally, each container has an `opt/fluent` folder where its service’s source code resides.

## Appendix

### Being on the Battery may Jinx Your System

Make sure that you are not running anything else on your system while you’re running your benchmarks.

Also when you are running any kind of benchmark, make sure that the system is not on battery. Laptops do lots of things that slow down the system performance, to preserve power, when on battery. — For instance Mac OS does crazy cpu deoptimizations to save battery when not connected to the power cord. And those optimizations are *non-deterministic* (to my observation), which can lead in having significantly different results when you run the same test with the same parameters repeatedly. 

### About the `ab` Test Tool

During initial sections of the demo we use the [`ab`][ab] tool to measure the application’s throughput.

There are, however, some problems with `ab` to be aware of:

Firstly, `ab` will **flood** the server as fast as it can generate the requests. It has no option to delay between the requests.

Given that the network layer is essentially bypassed (*i.e., because of proximity we can assume zero network delay for all practical purposes*), `ab` will create a peak level of requests that will eventually saturate the resources.

Also, expect the behavior of the `ab` tests to be increasingly non-deterministic under higher concurrent loads.

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

Again, when opening large number of connections, `ab` test might turn out to be non-deterministic and unreliable due to ephemeral port exhaustion. In that case, waiting for ~4 minutes, and restarting the containers will help stabilize things.

If you need really high concurrency, then you’d be better off to use a distributed load testing setup (*like a cluster of AWS instances in different zones, or a distributed load testing “as a service” solution*).

One last thing is `ab` is an **HTTP/1.0** client; i.e., it’s not an HTTP/1.1 client, therefore what you test with `ab` will **not** represent how your API behaves in the wild.

### Thinks To Watch Out For When Running an `ab` Test

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

Here are certain tools and services that you can evaluate. This is, by no means a conclusive list:

* <https://blazemeter.com>
* <http://smartbear.com/>
* <http://jmeter.apache.org/>

> **Note**
> 
> There are more tools for **CI/CD**, **Automation**, **Cloud Monitoring**, **Post-Mortem Diagnostics**, **Private Package Management**, etc. that I will be mentioning during the talk.

### License

**MIT** License

[See the License file for details](LICENSE.md).


[talk]: http://conferences.oreilly.com/fluent/javascript-html-us/public/schedule/detail/46028 "Scaling Your Node.JS API Like a Boss" 
[docker]: https://www.docker.com "Docker: Build, Ship, Run"
[docker-run]: https://docs.docker.com/engine/reference/run/ "Docker: `run` command."
[ab]: https://httpd.apache.org/docs/2.2/programs/ab.html
[webstorm]: https://www.jetbrains.com/webstorm/ "Webstorm: The smartest JavaScript IDE!"
