var express = require('express');
var path = require('path');
var app = express();

var server = require('http').createServer(app).listen(process.env.PORT || 5000, function(){console.log('ready to work');});
var io = require('socket.io').listen(server);
var ww = require('./wwgame.js');
var router = require('./routes/index');

var players=0;


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
  newPlayer(sock, 'lobby');
}

function newPlayer(player, roomName){
  player.join(roomName);
  players++;
  player.emit('msg', 'Welcome to ' + roomName + '! There are currently ' + players + ' players in the lobby.');
  player.to('lobby').emit('msg', 'There are now ' + players + ' players in the lobby.');

  player.on('disconnect', function(){
    players--;
    sock.to(roomName).emit('msg', 'A player has left! There are now ' + players + ' players in the lobby.');
  });
}

