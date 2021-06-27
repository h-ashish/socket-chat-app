const express = require('express');
const socketio = require('socket.io');
const PORT = 3000;
const formatMessage = require('./utils/messages');
const {
		userJoin, 
		gettingCurrentUser, 
		userLeaves, 
		getRoomUsers} = require('./utils/users');

const app = express();
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`)) ;

const io = socketio(server);

app.use(express.static("public"));

const botName = 'Socket Chat Bot';

io.on('connection', socket =>{

	socket.on('joinRoom', ({username, room})=>{

		const user = userJoin(socket.id, username, room);

		socket.join(user.room);

		socket.emit('message', formatMessage(botName, "Welcome to Socket Chat"));

		//when user connects
		socket.broadcast
			.to(user.room)
			.emit('message', formatMessage(botName,`${user.username} has joined the chat` ));

		//sending room info
		io.to(user.room).emit('roomUsers',{
			room: user.room,
			users: getRoomUsers(user.room)
		})

	})

	//chat message
	socket.on('chatMessage', (msg) => {
		const user = gettingCurrentUser(socket.id);

		io.to(user.room).emit('message', formatMessage(user.username,msg))
	})

	//when user disconnects
	socket.on('disconnect', ()=>{

		const user = userLeaves(socket.id);

		if(user) {
			io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`));
			//sending room info
			io.to(user.room).emit('roomUsers',{
				room: user.room,
				users: getRoomUsers(user.room)
			})
		}

	})
})


