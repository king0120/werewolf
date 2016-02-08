//When the startgame button is clicked, the game will begin
// $('#startGame').on('click', function(){
//   players--;
//   // $('#waiting').show();
//   // $('#waiting').append('Waiting on ' + players + ' other players.');
// });


$(document).ready(function() {
  var IO = {
    init: function() {
      console.log("IO Start");
      IO.socket = io.connect();
      IO.bindEvents();
      IO.socket.on('msg', onMessage);
    },


    bindEvents: function() {
      IO.socket.on('connected', IO.onConnected);
      IO.socket.on('newGameCreated', IO.newGameCreated);
      IO.socket.on('playerJoinedRoom', IO.playerJoinedRoom);
    },

    onConnected: function() {
      console.log('connected');
      //Cache a copy of the clients socket id on the app
      App.mySocketId = IO.socket.sessionID;
    },

    //Retrieves GameID from server
    //params gameId and mySocketId
    newGameCreated: function(data) {
      console.log("newGameCreated data: " + data.gameId);
      App.Host.gameInit(data);
    },

    //Alerts users that a player has joined the lobby
    playerJoinedRoom: function(data) {
      console.log('Player joined room');
      //Takes data from server and runs separate update functions for host and player
      App[App.myRole].updateWaitingScreen(data);
    }
  };

  var App = {

    //Keeps track of the GameId which is identical to the socket.io room
    gameId: 0,

    //differentiates between host and player
    myRole: '',

    //Keeps track of the unique socket id for the user
    mySocketId: '',

    init: function() {
      console.log('App Start!');
      App.cacheElements();
      App.bindEvents();
    },

    //creates click references for onscreen events
    cacheElements: function() {
      App.$doc = $(document);
      App.$templateIntroScreen = $('.introScreen');
      App.$templateNewGame = $('.hostScreen');
      App.$templateJoinGame = $('.joinScreen');
    },

    bindEvents: function() {
      //Host Events
      App.$doc.on('click', "#hostGame", App.Host.onHostGame);
      App.$doc.on('click', '#playerGame', App.Player.onJoin);
      App.$doc.on('click', '#btnStart', App.Player.onPlayerStart);
    },

    //HOST DATA
    Host: {
      //contains references to player data
      players: [],


      //will start a new game at the end of a round.
      isNewGame: false,

      //keeps track of number of players in the room
      numPlayers: 0,

      onHostGame: function(data) {
        console.log('created a game');
        IO.socket.emit('hostCreateGame');
      },

      gameInit: function(data) {
        console.log('Game Init');
        App.gameId = data.gameId;
        App.mySocketId = data.mySocketId;
        App.myRole = 'Host';
        App.Host.numPlayers = 0;
        console.log('App.gameId: ' + App.gameId + ' App.mySocketId ' + App.mySocketId);
        App.Host.displayNewGameScreen();
      },

      //Updates the Host screen when a new player joins
      //Data includes username as a string
      updateWaitingScreen: function(data) {
        if (App.Host.isNewGame) {
          console.log("Reset Game.  Code Under Construction");
        }
        console.log(data);
        console.log('Host update waiting screen');
        $('#playersWaiting').append("Player " + data.username + " has joined the game.");

        //Updates Host data
        App.Host.players.push(data);
        App.Host.numPlayers++;

        if (App.Host.numPlayers >= 3) {
          $('#startGameButton').show();
        }
      },

      displayNewGameScreen: function() {
        page = 'host';
        console.log('Start a game');
        App.$templateIntroScreen.hide();
        App.$templateNewGame.show();
        $('.serverAddress').append(window.location.href);
        $('.lobbyAddress').append(App.gameId);
      }
    },

    //Player Data
    Player: {
      //reference to the socket Id of the host
      hostSocketId: '',

      //Players username
      userName: '',

      onJoin: function() {
        console.log('onJoin clicked');
        App.$templateIntroScreen.hide();
        App.$templateJoinGame.show();
      },

      onPlayerStart: function() {

        //Collect players data to send to server
        var data = {
          gameId: $("#inputLobby").val(),
          username: $('#inputUsername').val()
        };

        console.log('Attempting to join ' + data.gameId + '!');

        //Set properties for player
        App.myRole = 'Player';
        App.Player.username = data.username;

        //Send data to server
        IO.socket.emit('playerJoinGame', data);
      },

      updateWaitingScreen: function(data) {
        App.myRole = 'Player';
        App.gameId = data.gameId;

        $('#waitingMessage').append('<br/>' + data.username + 'joined the game!');

      }
    }
  };

  function onMessage(text) {
    var list = document.getElementById('chat');
    var el = document.createElement('li');
    el.innerHTML = text;
    list.appendChild(el);
  }

  var form = document.getElementById('chat-form');

  form.addEventListener('submit', function(e) {
    var input = document.getElementById('chat-input');
    var username = document.getElementById('chat-name').value;
    var value = input.value;
    input.value = '';
    IO.socket.emit('msg', username + ": " + value);
    IO.socket.emit('username', username);
    e.preventDefault();
  });


  IO.init();
  App.init();
});
