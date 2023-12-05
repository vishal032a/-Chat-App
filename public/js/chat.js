let socket = io({reconnection: false});

function scrollToBottom(){
    let messages = document.querySelector('#messages').lastElementChild;
    messages.scrollIntoView();
}

socket.on('connect', function() {
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
  
    socket.emit('join', params, function(err) {
      if(err){
        alert(err);
        window.location.href = '/';
      }else {
        console.log('No Error');
      }
    })
  });

socket.on('disconnect',function (){
    console.log('disconnected from server.');
});

socket.on('newMessage',function (message){
    const formattedTime = moment(message.createdAt).format('LT')
    const template = document.querySelector('#message-template').innerHTML;
    const html = Mustache.render(template,{
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });

    const div = document.createElement('div');
    div.innerHTML = html
    document.querySelector('#messages').appendChild(div);
    scrollToBottom();
});



document.querySelector('#submit-btn').addEventListener('click',function(e){
    e.preventDefault();

    socket.emit("createMessage",{
        from: "User",
        text:
        document.querySelector('input[name="message"]').value
    },function(){

    })
})
