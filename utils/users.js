const users = [];

//Joining users
function userJoin(id, username, room){
	const user = {id, username, room};

	users.push(user);

	return user;
}

//getting current user 
function gettingCurrentUser(id){
	return users.find(user => user.id === id);
}

//users leaving
function userLeaves(id){
	const index = users.findIndex(user => user.id === id);

	if(index !== -1){
		return users.splice(index, 1)[0];
	}
}

//getting room
function getRoomUsers(room){
	return users.filter(user => user.room === room);
}

module.exports = {
	userJoin,
	gettingCurrentUser,
	userLeaves,
	getRoomUsers
}