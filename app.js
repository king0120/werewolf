var express = require('express');
var path = require('path');
var app = express();

var server = require('http').createServer(app).listen(process.env.PORT || 5000, function(){console.log('ready to work');});
var io = require('socket.io').listen(server);
var ww = require('./wwgame.js');
var router = require('./routes/index');

io.on('connection', onConnection);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

function onConnection(sock){
  sock.emit('msg', 'Hello!');
  sock.on('msg', function(txt){
    io.emit('msg', txt);
  });
}
