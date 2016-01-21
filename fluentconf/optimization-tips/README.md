> **Note**
> 
> Please note that thest are just useful guidelines. You will never know how your app performs without actually measuring it. Do not blindly apply performance advice; do not optimize prematurely. Look at your metrics, and optimize only what’s needed.

You can use…

```bash
node --trace_opt --trace_deopt --allow-natives-syntax test.js
```

…to see how v8 runtime optimizes and deoptimized functions.

See [BlueBird’s Optimization Killers Page](https://github.com/petkaantonov/bluebird/wiki/Optimization-killers) for more details.
