var gameLobby = require("./gameLobby");


module.exports = Game;


function Game(dl, cash){
	this.dl = dl;
	this.cash = cash;
	this.gameLobby = new gameLobby(); 
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
		return callback(new Error("User is already logedin"), null);
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
		
		this.gameLobby.EnterTable(data.table.id, data.user, Socket, function(msg){
			callback(msg);
		});
	}else{
		callback({'msg':'user was not found'})
	}
}

Game.prototype.IsLogedIn = function(Socket){
	return this.cash.GetPlayer(Socket)?true:false;
}

Game.prototype.SingoutPlayer = function(Socket) { // to do save player with the new money
	var player = this.cash.GetPlayer(Socket);
	this.cash.RemovePlayer(Socket);
}
