const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message')
const {isRealString} = require('./utils/isRealString');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);

// Use the `serveClient` option to let Socket.IO handle its own route
let io = socketIO(server, { serveClient: true });

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("A new user just connected");

  

    socket.on('join', (params, callback) => {
        if (!(isRealString(params.name)) || !(isRealString(params.room))) {
            callback('Name and room are required');
        }

        socket.join(params.room);

        socket.emit('newMessage',generateMessage('Admin',`Welcome to  ${params.room}`));

        socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'))
    

        callback();
    });

    socket.on('createMessage',(message,callback)=>{
        console.log("createMessage",message);
        io.emit('newMessage',generateMessage(message.from,message.text));
        callback('This is the server');
    })

    socket.on('disconnect',()=>{
        console.log('User was disconnected');
    });
});



server.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
