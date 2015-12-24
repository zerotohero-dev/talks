Source code for my FluenConf talk.

<http://conferences.oreilly.com/fluent/javascript-html-us/public/schedule/detail/46028> 

> **Note**
>
> I’m constantly adding bits and pieces here, and updating the code in this folder almost daily.
>
> Stay tuned.

I’ll update this README.

## Environment Setup

### Host Machine

> The demos here use [docker][docker] containers ona Mac OS laptop. If you are using a different operating system, then your setup might be different.

Before starting docker, I ran these commands on the host to configure networking. These are probably not necessary as each docker container manages its own **maxfile** and **socket** limits. Yet, since a docker container is not strictly independent from its host system, I've put them "just in case":

```bash
user@Macbook:/#
sudo sysctl -w kern.maxfiles=65536
sudo sysctl -w kern.maxfilesperproc=65000
sudo sysctl -w kern.ipc.somaxconn=60000
ulimit -S -n 50000
```

### Containers

The containers have `128` maximum socket connections by default. This is not enough for highly-concurrent load testing. You'll need to run the containers in
[privileged mode][privileged] and execute the following **in the containers** so that the network requests do not drop and/or the test do not crash in the middle.

```bash
root@container:/#
# The default is 128.
# You typically pick something around 1024-2048 for this for production.
# We are choosing a little higher, to produce smoother results.
sysctl -w net.core.somaxconn=32768
```

ab -r -n 40000 -c 4000 http://172.17.0.3:8080/hello

Also verify that you have proper limits.

```bash
root@container:/#
ulimit -a
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

You'll especially want **high** `open files` and `max user processes` numbers.

If they are not high enough, consider raising them with `ulimit -w`

You may also want to modify the local ephemeral port ranges on the containers:

```bash
root@container:/#
# The default is "32768 61000" and it's "suficcent" for our purposes.
# Increasing the range a bit won't hurt though:
sysctl -w net.ipv4.ip_local_port_range="1024 65000"
```

### Notes About `ab` Test

There are some problems with ab to be aware of –

First of all `ab -n 40000 -c 4000` is **a lot**. That is "*4000
concurrent users, each doing 10 page hits*". — Since network latency
is essentially zero (*because the containers are on a virtual
private subnet on the same machine*)

> `ab` will **flood** the server as fast as it can generate the requests. It has no option to delay between the requests.

Given that the network layer is essentially bypassed, `ab` will create a peak level of requests that will eventually start the container OS, or the Node.JS instance, or both stop responding and start blocking additional requests. Especially if the requested resource is a very simple page that served in a few milliseconds.

> Expect the behavior of the ab tests to be increasingly non-deterministic under higher concurrent loads.

In the current few tests the number of requests (`-n`) is high to observe the maximum throughput of the system. In a production benchmark, using `ab` with lower `-n` and `-c` values (*like `-n == 400, -c == 10`) and then slowly increasing the values would provide much valuable insights.

Again, when opening large number of connections, `ab` test might turn out to be non-deterministic unreliable due to ephemeral port exhaustion. In that case, waiting for ~4 minutes, and restarting the containers will help stabilize things.

> As a rule of thumb, when you increase `-c`, consider lowering `-n`.
>
> Even with relatively low values like `-c == 10` and `-n == 500` you can get pretty intuitive results.
>
> Do not increate the limits too much.
>
> If you need really high concurrency, then you'd better use a distributed load testing setup (*like a cluster of AWS instance in different zones, or a distributed load teesting "as a service" solution*).

Additionally, testing an almost empty static API response does not tell too much about how different parts of our API holds up under stress, or how different API paths affect each other (*e.g., does reponse to a GET request slow down because a high concurrency on a POST causing a bottleneck on the persistence layer, etc.*)

One last thing is `ab` is an **HTTP/1.0** client; i.e., it's not an HTTP/1.1 client, therefore what you test with `ab` will **not** represent how your API behaves in the wild.

Before running your `ab` tests, make sure that:

* Nothing else is consuming network resources (*there are no downloads, no browser tabs open*).
* There is no CPU-intensive activity (*such as a scheduled background task*).
* You restart the service before each test.
* If there's anything suspicious, wait for 4 minutes to avoid ephemeral port exhaustion, and try again.
* Repeat tests five times, eliminate the top and bottom ones, and use the average of the remaining three.

### Additional Notes

#### **Load Testing** versus **Stress Testing**

A **load test** is usually conducted to understand the behavior of the system under a specific expected load; whereas a **stress test** is a test to understand the upper capacity limits of a system, it measures the system's robustness under extreme load.

#### Running Tests From Multiple Geolocations

Running a geographically spread test is important because it's the closest way to mimic actual end usage pattern. Besides, when you start assuming non-zero network delay, **concurrency** and **throughput** metrics start becmoning much more meaningful. — Additionally, this kind of test will be benchmarking your entire architecture as a whole (*i.e., your caching layer, your load balancer, etc.*), and in the end of the day, that **is** what matters. — Nobody cares how cool your architecture is; the only thing the users care about is how **fast** and how **reliable** your APIs are.

#### Load Testing and Benchmarking Tools and Services

Here are certain tools and services that you can evaluate. This is, by no means a conclusive list.

* https://github.com/kubernetes/kubernetes
* https://blazemeter.com
* http://smartbear.com/
* http://jmeter.apache.org/
* TODO:// add more.

#### Configuration Files

* [etc/sysctl.conf](containers/service/etc/sysctl.conf)
* // TODO: add more

### Show Me The Results

[The **Worklog**](WORKLOG.MD) contains a log of setups that I've created with progressively increasing complexity, and benchmark tests related to them.

### Show Me The Deck

// TODO: link to slide deck.

### License

MIT

// TODO: link to the license file.
