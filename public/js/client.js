console.log("Hello from client.js");

var sock = io();
sock.on('msg', onMessage);

function onMessage(text){
  var list = document.getElementById('chat');
  var el = document.createElement('li');
  el.innerHTML = text;
  list.appendChild(el);
}

var form = document.getElementById('chat-form');

form.addEventListener('submit', function(e){
  var input = document.getElementById('chat-input');
  var value = input.value;
  input.value = '';
  sock.emit('msg', value);
  e.preventDefault();
});
