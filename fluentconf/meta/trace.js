// var net = require('net');
// var client = net.connect({port: 4322, host: '172.17.0.2'},
//     function() { //'connect' listener
//   console.log('connected to server!');
//   client.write('world!\r\n');
// });
// client.on('data', function(data) {
//   console.log(data.toString());
// //  client.end();
// });
// client.on('end', function() {
//   console.log('disconnected from server');
// });

// exports.remote = function(traces){
//     // console.* calls relay to the local client
//     var id = setInterval(function(){
//     console.log({
//       user: {
//         n ame: {
//           first: 'tobi',
//           last: 'ferret'
//         }
//       }
//     });
//     }, 100);
//
//     traces.on('cleanup', function(){
//     clearInterval(id);
//     });
// };
