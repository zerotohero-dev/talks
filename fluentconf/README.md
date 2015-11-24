Source code for my FluenConf talk.

I'll update this README.

// TODO: create a init script for the containers to run when they initially boot (adjust somaxconn and other limits)

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

note: for some reason after testing the app on port 8080 extensively, port 8081 did not work; I suspect something ephemeral (pun intended); when I waited for
a while and retried, everything was normal; which suggest for a healthier test it makes sense to rebooot servers or use two different instances.

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

### Additional Notes

// TODO: add sample configurations for actual production use.

### Show Me The Results

[The **Worklog**](WORKLOG.MD) contains a log of setups that I've created with progressively increasing complexity, and benchmark tests related to them.

### Show Me The Deck

// TODO: link to slide deck.

### License

MIT

// TODO: link to the license file.
