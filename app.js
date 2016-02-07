//Import Express
var express = require('express');
//Use path to render styles
var path = require('path');
//Import Sass
var sass = require('node-sass-middleware');
//Create new instance of express
var app = express();
//Create a new server
var server = require('http').createServer(app).listen(process.env.PORT || 3000, function(){console.log('ready to work');});
var io = require('socket.io').listen(server);

//import the werewolf game file
var ww = require('./wwgame.js');

//import the routes (not really necesarry?)
var router = require('./routes/index');

//Start socket io on connection
io.sockets.on('connection', function (socket) {
    //console.log('client connected');
    ww.initGame(io, socket);
});

app.set('view options',{layout:false});
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);
