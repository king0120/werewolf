var io;
var gamesocket;

exports.initGame = function(io, socket) {
  console.log('init');
  gameSocket = socket;
  gameSocket.emit('connected');
  //Game Events
  gameSocket.on('msg', chat);

  //Host Events
  gameSocket.on('hostCreateGame', hostCreateGame);

  //Player Events
  gameSocket.on('playerJoinGame', playerJoinGame);


  //Host Functions
  function hostCreateGame(){
    //create a unique game id
    var thisGameId = Math.floor(Math.random() * 500);

    console.log('joined ' + thisGameId);
    console.log(thisGameId.toString());

    this.join(thisGameId.toString());


    console.log(gameSocket.rooms);

    this.emit('newGameCreated', {
      gameId: thisGameId,
      mySocketId: this.id
    });
  }

  //Player functions

  //Player Clicked Join Game and entered the appropriate lobby (hopefully)
  //data contains username and gameId
  function playerJoinGame(data){
    console.log('Player ' + data.username + ' is attempting to join game #' + data.gameId);
    console.log(data.gameId);
    console.log(this.rooms);
    console.log(gameSocket.rooms);
    // console.log(data.gameId);
    //finds roomId in the Socket.io manager object
    var room = gameSocket.rooms[data.gameId];
    console.log(room);
    if (room !== undefined){
      //attaches socketId to the data object
      data.mySocketId = this.id;

      //join the room
      this.join(data.gameId);

      console.log("Player " + data.username+ " joined game " + data.gameId);

      //emits message notifying a player entering lobby
      io.sockets.in(data.gameId.toString()).emit('playerJoinedRoom', data);
    } else {
      //Send error message to server
      console.log('error');
    }
  }

  function chat(txt) {
    console.log('msg sent');
    io.emit('msg', txt);
  }

};
