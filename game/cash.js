module.exports = cash;
var gameLobby = require("./player");

function cash(){

	var players = {};
	var playersSockets = {};
	this.AddPlayer = function(Socket, user){
		players[user._id] = {'user':user,'socketId':Socket.id};
		playersSockets[Socket.id] = user._id;
		return players[user._id];
	}

	this.GetPlayer = function(_id){ // _id - player id
		return players[_id];
	}
	this.GetPlayerBySocket = function(Socket){ // _id - player id
		return players[playersSockets[Socket.id]];
	}
	
	
	this.GetPlayerByUserId = function(_id){
		var test = players[_id];
		return players[_id];
	}

	this.RemovePlayer = function(Socket){
		if(playersSockets[Socket.id]){
			var userId = playersSockets[Socket.id];
			delete players[userId];
			delete playersSockets[Socket.id];
		}

	}

	this.GetAll = function(){
		return players;
	}

}

