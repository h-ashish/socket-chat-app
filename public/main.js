const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//getting username and room values
const {username, room} = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});

const socket = io();

//joining room
socket.emit('joinRoom', {username, room});

//getting room and users
socket.on('roomUsers', ({room, users}) => {
	outputRoomName(room);
	outputUsers(users);
})

//messages from server
socket.on("message", message =>{ 
	console.log(message);
	output(message);

	chatMessages.scrollTop = chatMessages.scrollHeight;

})

// submit
chatForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const msg = e.target.elements.msg.value;
	socket.emit('chatMessage', msg);

	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
})

//output in dom
function output(message){
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">
              ${message.text}
            </p>`;
    document.querySelector('.chat-messages').appendChild(div);

}

//adding room name to DOM
function outputRoomName(room) {
	roomName.innerText = room;
}

//adding users to DOM 
function outputUsers(users){
	userList.innerHTML = `
	${users.map(user => `<li> ${user.username} </li>`).join('')}
	`
}

document.getElementById('leave-btn').addEventListener('click', ()=>{
	window.location = './index.html';
})