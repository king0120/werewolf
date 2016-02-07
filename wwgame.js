var players = 0;
var playerNames = [];

exports.initGame = function(io, socket) {
  console.log('init');

  //Game Events
  socket.on('msg', chat);
  socket.on('hostCreateGame', hostCreateGame);
  // socket.set('nickname', 'Guest');

  newPlayer(socket, 'lobby');

  socket.on('username', function(username) {
    socket.username = username;
  });

  //Host Functions
  function hostCreateGame(){
    //create a unique game id
    var thisGameId = Math.floor(Math.random() * 500);

    this.emit('newGameCreated', {
      gameId: thisGameId,
      mySocketId: this.id
    });
    page = 'host';
    console.log('joined ' + thisGameId);
    this.join(thisGameId.toString());

  }

  function newPlayer(player, roomName) {
    console.log(player.id + ' connected');
    player.join(roomName);
    players++;

    player.to(roomName).emit('players', 'There are now ' + players + ' players in the lobby.');

    player.emit('players', 'Welcome to ' + roomName + '! There are currently ' + players + ' players in the lobby.', players);



    player.on('disconnect', function() {
      players--;
      console.log(player.id + ' disconnected');
      player.to(roomName).emit('players', 'A player has left! There are now ' + players + ' players in the lobby.');
    });
  }

  function chat(txt) {
    console.log('msg sent');
    io.emit('msg', txt);
  }

};
