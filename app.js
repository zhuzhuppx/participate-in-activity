var express = require('express');
var route = require('./server/route.js')
var app = express();
route(app);
app.use(express.static('dist'));
app.listen(3000);
console.log('server started...');
