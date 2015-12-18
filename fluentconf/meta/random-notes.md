// TODO: process this file and add parts of it to README.md etc.

note:
I'll probably have to use redis when I start load balancing and want to persist state/cache between clusters.

/*

endpoint 1:
    * Get a URL
    * extract meaningful text-only content
    * create a set of tags out of that text content
    * store the url/tag mapping in the memory.
    * (the results will be computed every time, and will **not** be
    cached for the sake of the demo.)

endpoint 2:
    * Given a URL
    * Query the memory
    * Get computed tags associated to the url.
*/

// var amqp = require('amqp');
//
// var connection = amqp.createConnection({ host: '192.168.99.100' });
//
// // Wait for connection to become established.
// connection.on('ready', function () {
//     console.log( 'connection is ready' );
//
//   // Use the default 'amq.topic' exchange
//   connection.queue('my-queue', function (q) {
//       // Catch all messages
//       q.bind('#');
//
//       // Receive messages
//       q.subscribe(function (message) {
//         // Print messages to stdout
//         console.log('connection1');
//         console.log(message.data.toString() );
//       });
//   });
// });
//
//
// var connection2 = amqp.createConnection({ host: '192.168.99.100' });
//
// // Wait for connection to become established.
// connection2.on('ready', function () {
//     console.log( 'connection2 is ready' );
//
//   // Use the default 'amq.topic' exchange
//   connection2.queue('my-queue-2', function (q) {
//       // Catch all messages
//       q.bind('#');
//
//       // Receive messages
//       q.subscribe(function (message) {
//         // Print messages to stdout
//         console.log('connection2.');
//         console.log(message.data.toString() );
//       });
//   });
// ‘’
//   setInterval(function() {
//       connection2.publish('my-queue', 'body', {}, function(err) {
//           console.log('pbulseid');
//       });
//
//       connection2.publish('my-queue-2', 'body', {}, function(err) {
//           console.log('pbulseid');
//       });
//   }, 1000);
//
//
//   // connection2.publish('my-queue-2', 'body', {}, function(err) {
//   //     console.log('pbulseid');
//   // });
// });


## Managing containers

To automatically configure containers, I'm executing a run script at `/etc/bash.bashrc`. That's not the ideal way of doing it. To manage clusters of containers a tool like fleet (link), or kubernetes (link) should be used instead.

## Fix your repo versions

Some people may frown at this, and for production use do not use ~ or ^ versions in your package.json — Use fixed versions as in…

    "babel": "6.1.18",
    "babel-preset-es2015": "6.1.18",
    "babel-register": "6.2.0",
    "bluebird": "3.0.6",
    "body-parser": "1.14.1",
    "express": "4.13.3",
    "graphql": "0.4.14"

also for production use a private npm server (give examples -- also install one maybe)


## Tips

Build an architecture where concerns are separated amongst different classes of servers, where each class is independently scalable. This is particularly important to keep your web servers responsive and not block the event loop on each one.
Allow your long-running processes to leave breadcrumbs as they run so that progress can be inspected and processing can be resumed by any other worker should a failure occur.
Wrap all asynchronous code with a solid promise library. Additionally, wrap calls to the promisified functions with retry logic where applicable.
Explore good, reusable patterns and then reuse them as much as possible.

## MicroServices and All That Jazz

* Configuration Management (CM) — Chef/Puppet/Salt
* Service Discovery — Consul
* Use Proxies (don't let microservices talk to each other directly) — NGINX
* Clustering and Scaling
* Self Healing Systems

Package your microservices into containers with Docker or, once it’s production ready, rkt.
Don’t provision environments manually. Employ CM tools like Ansible to do that for you.
Don’t configure applications manually nor with CM tools. Use service discovery with combinations like Consul, Registrator and Consul Template or etcd, Registrator and confd.
Use proxy services like nginx or HAProxy as the (almost) only way to make requests (be it from outside or from one of your services to another).
Avoid downtime produced by deployments by employing blue-green procedure.
Treat all your servers as one big entity. Use tools like Kubernetes, Mesosphere DCOS and Docker Swarm to deploy services.
Don’t spend your career watching dashboard of some monitoring tool. Set up a self-healing system that will re-initiate deployments when things go wrong or some threshold is reached.



## More Tips

* Sync code? Run away like hell!
* Don't use Node.JS for static assets
* Go sessionless (even if you use a remote session store, each request will incur an overhead of a remote call to gather its session data; whenever possible aoviding sessions will give better performance)
* Keep your code, small, light, and modular.

## 1 Million Connections?

It’s not about concurrency, it’s about throughput and latency!

Tests like this http://blog.caustik.com/category/node-js/ just open sockets and do nothing else; that's not practical. — A real-life application is much complex than that, and you'll hit a lot of different bottlenecks before you barely touch the 1.4GB heap limit that's mentioned in the article. — Consider yourself lucky if you can reach 10K concurrent connections per virtual machine. — In reality your concurrency level will set between 5K to 50K even for the most meticulously-optimized service. — And even if you do reach a certain limit (like the heap max) before, horizontal scaling would be a much better strategy than putting all your eggs in a single basket.

## Debugging

Instrument everything. Count connections, callbacks and every kind of object that might create a memory leak if it does not get cleaned up. If you have one registered callback for every connection, instrument the count for both so you can see if there’s some disparity.
Once you have instrumented everything, graph the data. Looking at graphs lets you see how the data changes over time and helps you notice irregularities. The graphs also tell you what kind of problems you’re facing. Does the metric for X grow in a linear fashion or does it follow the changes in some other metric?
Throw your debugger out of the window. Alternatively, you could structure your code so that a heap dump shows meaningful information about retained memory content – things like named functions and certain types of objects. But in our experience, compiled code and functions tend to be the most visible content. So either carefully design your architecture to give really neat heap dumps, or rely more on your instrumentation.
Simulate real world usage with a script and see how your app behaves. Notice any disparities in counters that should measure the same thing, like a disparity between the number of callbacks and active clients if those should match.

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

##

The first thing I'm going to look at will be the event loop delay.

There are several ways to measure that. For instance you can run a timer, and look at how much the timer is lagging behind:

```javascript
let start = process.hrtime();
setInterval( () => {
    delta = process.hrtime( start );

    trace(
        'eventloop:delay',
        ( ( delta[ 0 ] * 10e9 + delta[ 1 ] )  / ( 10e6 ) ) - INTERVAL
    );

    start = process.hrtime();
}, INTERVAL );
```

Another, relatively more accurate way would be to fire an `setImmediate` callback and measure the time it takes to respond.

<aside>Callbacks for immediates are queued in the order in which they were created. The entire callback queue is processed every event loop iteration. (That was not the case in earlier versions; i.e., only one setImmediate callback was being executed per event loop iteration; however, as of Node.js 5.x, at least, all the setImmediate queue is cleared before entering the next event loop)</aside>

`setImmediate` fires at the very beginning of the next event loop, which makes it a proper candidate to measure the event loop lag. Here's the above code, modified to use `setImmediate`:

```javascript
setInterval( () => {
    delta = process.hrtime( start );

    let start = process.hrtime();
    setImmediate( () => {
        let delta = process.hrtime(start);

        trace(
            'eventloop:delay',
            ( ( delta[ 0 ] * 10e9 + delta[ 1 ] )  / ( 10e6 ) )
        );
    } );
}, INTERVAL );
```
