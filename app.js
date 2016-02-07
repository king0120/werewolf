var express = require('express');
var path = require('path');
var sass = require('node-sass-middleware');
var app = express();
var server = require('http').createServer(app).listen(process.env.PORT || 3000, function(){console.log('ready to work');});
var io = require('socket.io').listen(server);
var ww = require('./wwgame.js');
var router = require('./routes/index');

var players=0;


io.on('connection', onConnection);
app.set('view options',{layout:false});
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

function onConnection(socket){
  socket.on('msg', function(txt){
    io.emit('msg', txt);
  });
  newPlayer(socket, 'lobby');

}

function newPlayer(player, roomName){
  player.join(roomName);
  players++;

  player.to(roomName).emit('players', 'There are now ' + players + ' players in the lobby.');

  player.emit('players', 'Welcome to ' + roomName + '! There are currently ' + players + ' players in the lobby.');



  player.on('disconnect', function(){
    players--;
    player.to(roomName).emit('players', 'A player has left! There are now ' + players + ' players in the lobby.');
  });
}


