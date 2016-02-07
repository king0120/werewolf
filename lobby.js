
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

  // player.on('disconnect', function(){
  //   players--;
  //   sock.to(roomName).emit('msg', 'A player has left! There are now ' + players + ' players in the lobby.');
  // });
}
