module.exports = gameLobby;
var table = require('./table');

function gameLobby(io) {
	var io = io;
	var table1 = new table(8, io);

	// every function here should be call with table id
	
	this.EnterTable = function(tableId, player, Socket, callback){
		table1.AddPlayer(player, Socket, function(msg){
			callback(msg);
		});
	}
	
	this.RemoveFromTable = function(player, Socket) {
		table1.RemovePlayer(player, Socket)
	}
	
	this.PickASeat = function(player, Socket, seatLocation, callback){
		table1.PickSeat(player,Socket,seatLocation,callback);
	}
}



