// TODO:
// 1. make runner A that continously calls the "gettags" endpoint with a url.
// 2. make runner B that continously calls the "geturls" endpoint with a tag.


var chart = require('chart');
var clear = require('clear');

var data = [];
var n = 0;

var ACTION = 'get-urls';

exports.local = function(traces){
  traces.on('request:end', function(trace){ n++ });
};

setInterval(function(){
  data.push(n);
  n = 0;
  clear();
  console.log(chart(data));
}, 1000);
