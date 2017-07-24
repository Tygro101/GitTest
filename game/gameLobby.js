module.exports = gameLobby;
var table = require('./table');

function gameLobby() {
	var table1 = new table();



	this.EnterTable = function(tableId, player, Socket, callback){
		table1.AddPlayer(player, Socket, function(msg){
			callback(msg);
		});
	}
}



