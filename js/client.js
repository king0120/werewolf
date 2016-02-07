var sock = io();
var players = 0;
sock.on('msg', onMessage);

//When a player joins, The #players string updates
sock.on('players', function(data){
  console.log('data');
  $('#players').text(data);
  // players = data;
  // if (data >= 3){
  //   $('#startGame').show();
  // }
});

//When the startgame button is clicked, the game will begin
$('#startGame').on('click', function(){
  players--;
  $('#waiting').show();
  $('#waiting').append('Waiting on ' + players + ' other players.');
});

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
  sock.emit('msg', username + ": " + value);
  e.preventDefault();
});
