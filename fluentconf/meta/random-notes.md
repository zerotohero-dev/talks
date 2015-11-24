## Docker Link

 docker run -d -name webserver1 -link mongodb:mongo docker-network-demo/webserver:latest

## Be Careful With `ab`

note: when you are doing `ab -r` the rejected connections *may* also be counted as "*complete*", this will make your throughput appear to be higher than it's supposed to be.

This is `ab -r -n 40000 -c 4000` to a server that does not exist *at all*; and I get **only `~200`* failures.

```text
Concurrency Level:      4000
Time taken for tests:   12.245 seconds
Complete requests:      40000
Failed requests:        204
   (Connect: 0, Receive: 68, Length: 68, Exceptions: 68)
Total transferred:      5630412 bytes
HTML transferred:       559048 bytes
Requests per second:    3266.70 [#/sec] (mean)
Time per request:       1224.476 [ms] (mean)
Time per request:       0.306 [ms] (mean, across all concurrent requests)
Transfer rate:          449.05 [Kbytes/sec] received
```

If the result you get out of `ab` is unlikely (*i.e., too high, or too low*) then it makes sense to run the same test a few more times and see if it changes; you might also want to try rebooting the docker containers and re-running the benchmark, or even rebooting the entire docker VM.

To avoid those discrepencies I **don't** run `ab` with `-r` option until I reach the breaking point and it starts giving "socket timed out" error. After that point, I run the test with the `-r` option a few more times to see how the outcome pans out. If there's an inexplicable deviation, then I get skeptical.

## Some Tools

https://flood.io

## Simple Ephemeral Port Selection Algorithm

```
num_ephemeral = max_ephemeral - min_ephemeral + 1;
next_ephemeral = min_ephemeral + (random() % num_ephemeral);
count = num_ephemeral;

do {
    if(check_suitable_port(next_ephemeral))
            return next_ephemeral;

    if (next_ephemeral == max_ephemeral) {
        next_ephemeral = min_ephemeral;
    } else {
        next_ephemeral++;
    }

    count--;
} while (count > 0);

return ERROR;
```

> `check_suitable_port()` is a function that checks whether the
resulting port number is acceptable as an ephemeral port.  That
is, it checks whether the resulting port number is unique and may,
in addition, check that the port number is not in use for a
connection in the LISTEN or CLOSED states and that the port number
is not in the list of port numbers that should not be allocated as
ephemeral ports.  In BSD-derived systems, the
check_suitable_port() would correspond to the [`in_pcblookup_local()`][in_pcb_c]
function, where all the necessary checks would be performed.

[in_pcb_c]: http://unix.superglobalmegacorp.com/xnu/newsrc/bsd/netinet/in_pcb.c.html

## `http.globalAgent.maxSockets`

> http.globalAgents.maxSockets (default is Infinity)

This used to be limitation in older versions of the node. It looks like it's defaulted to `Infinity` right now, which is good.

##

function checkDelay() {
    var ts=Date.now();
    setImmediate(function()
    {
      var delay=Date.now()-ts;

      // log if not logged in the last second.
      console.log(delay);

      checkDelay();
    });
}

##

But docker0 is no ordinary interface. It is a virtual Ethernet bridge that automatically forwards packets between any other network interfaces that are attached to it. This lets containers communicate both with the host machine and with each other.
