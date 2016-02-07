//When the startgame button is clicked, the game will begin
// $('#startGame').on('click', function(){
//   players--;
//   // $('#waiting').show();
//   // $('#waiting').append('Waiting on ' + players + ' other players.');
// });


$(document).ready(function(){
  var IO = {
    init: function(){
      console.log("IO Start");
      IO.socket = io.connect();
      IO.bindEvents();
      IO.socket.on('msg', onMessage);
    },


    bindEvents: function(){
      IO.socket.on('connected', IO.onConnected);
      IO.socket.on('newGameCreated', IO.newGameCreated);
    },

    onConnected: function(){
      //Cache a copy of the clients socket id on the app
      App.mySocketId = IO.socket.socket.sessionID;
    },

    //Retrieves GameID from server
    newGameCreated: function(data){
      console.log(data.gameId);
      App.Host.gameInit(data);
    }
  };

  var App = {

    //Keeps track of the GameId which is identical to the socket.io room
    gameId: 0,

    //differentiates between host and player
    myRole: '',

    //Keeps track of the unique socket id for the user
    mySocketId: '',

    init: function(){
      console.log('App Start!');
      App.cacheElements();
      App.bindEvents();
    },

    //creates click references for onscreen events
    cacheElements: function(){
      App.$doc = $(document);
      App.$templateIntroScreen = $('.introScreen');
      App.$templateNewGame = $('.hostScreen');
    },

    bindEvents: function(){
      //Host Events
      App.$doc.on('click', "#hostGame", App.Host.onHostGame);
    },

    //HOST DATA
    Host: {
      //contains references to player data
      players: [],


      //will start a new game at the end of a round.
      isNewGame: false,

      //keeps track of number of players in the room
      numPlayers: 0,

      onHostGame: function(){
        IO.socket.emit('hostCreateGame');
      },

      gameInit: function(data){
        App.gameId = data.gameId;
        App.mySocketId = data.mySocketId;
        App.myRole = 'Host';
        App.Host.numPlayers = 0;

        App.Host.displayNewGameScreen();
        console.log('Game started with the id ' + App.gameId + ' by host ' + App.mySocketId);
      },

      displayNewGameScreen: function(){
        page = 'host';
        console.log('Start a game');
        App.$templateIntroScreen.hide();
        App.$templateNewGame.show();
        $('.serverAddress').append(window.location.href);
        $('.lobbyAddress').append(App.gameId);
      }
    }
  };

  function onMessage(text){
  var list = document.getElementById('chat');
  var el = document.createElement('li');
  el.innerHTML = text;
  list.appendChild(el);
}

var form = document.getElementById('chat-form');

form.addEventListener('submit', function(e){
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

