var gameLobby = require("./gameLobby");


module.exports = Game;


function Game(dl, cash, io){
	this.dl = dl;
	this.cash = cash;
	this.gameLobby = new gameLobby(io); 
	//this.io = io;
}

Game.prototype.Signup = function(Socket, data, callback){
	var cash = this.cash;
	this.dl.AddUser(data, function(err, data){
		if(err)
			return callback(err, null);
		return callback( null, cash.AddPlayer(Socket, data));		
	});
}

Game.prototype.Login = function(Socket, _id, callback){// bug - check if login not by socket if user._id is givin
	var cash = this.cash;
	if(this.IsLogedIn(_id)){
		return callback({'err':"User is already logedin"}, null);
	}
	this.dl.GetUser(_id, function(err, data){
		if(err)
			return callback(err, null);
		return callback( null, cash.AddPlayer(Socket, data));	
	});
}


Game.prototype.JoinTable = function(Socket, data, callback){
	var user = this.cash.GetPlayerByUserId(data.user._id);
	if(user){
		this.gameLobby.EnterTable(data.tableId, data.user, Socket, function(msg){
			callback(msg);
		});
	}else{
		callback({'msg':'user was not found'})
	}
}

Game.prototype.PickASeat = function (Socket, data, callback){ 
	var user = this.cash.GetPlayerByUserId(data.user._id); // O(1)
	if(user){
		this.gameLobby.PickASeat(user.user, Socket, data.seatLocation, function(msg){
			callback(msg);
		});
	}else{
		callback({'msg':'user was not found'})
	}
}

Game.prototype.IsLogedIn = function(_id){
	return this.cash.GetPlayerByUserId(_id)?true:false;
}

Game.prototype.SingoutPlayer = function(Socket) { // to do save player with the new money
	console.log('in player signout');
	var player = this.cash.GetPlayerBySocket(Socket);
	if(player){
		this.gameLobby.RemoveFromTable(player, Socket);
		this.cash.RemovePlayer(Socket);
	}
}
