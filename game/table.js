var uniqid = require("uniqid");
// add game engien with callback contract
// TODO add key of steatcount+blind and table id + server name + server port

var gameEngien = require("./gameEngien");

var Status = {
	WATCHER : 1,
	SITTING : 2
}

module.exports = table;


function table(maxSeats, io){// add distroy callback from lobby
	this.id = uniqid();
	this.players = {};
	this.seats_count = 0;
	this.blind = 0;
	this.maxByIn = 0;
	this.maxSeats = maxSeats;
	this.game = new gameEngien(this.EngienCllback, maxSeats, this.id, io);
	return this.id;
}


table.prototype.getMaxByIn = function(){
	return this.maxByIn;
}

table.prototype.AddPlayer = function(player, Socket, callback) { 
	//TODO if player exist remove it and put it again
	if(this.players[player._id]){
			callback({'status':'err', 'msg':'user already in table','tableId':this.id})
	}else{
		Socket.join(this.id);
		this.players[player._id] = {player, 'status':Status.WATCHER}; //'socket':Socket, 'status':Status.WATCHER};
		callback({'status':'watcher', 'msg':'user added to table','tableId':this.id})
	}
}


table.prototype.PickSeat = function(player, Socket, seatLocation, callback) {
	var tablePlayer = this.players[player._id]
	tablePlayer.status = Status.SITTING;
	var table = this;
	this.game.AddPlayer(tablePlayer.player, Socket, seatLocation,function(msg){
		table.AssignListeners(Socket)
		table.seats_count++;
		callback(msg);
	})

}

// maybe move it to game engien

table.prototype.AssignListeners = function(Socket){
	Socket.on('muck', function(msg){
		Socket.broadcast.emit('muck', {'playerId':msg.id});
	});
	
	Socket.on('check', function(msg){
		Socket.broadcast.emit('check', {'playerId':msg.id});
	});
	
	Socket.on('raise', function(msg) {
	    Socket.broadcast.emit('raise', {'playerId':msg.id, 'rase':msg.rase});
	})
	
}

table.prototype.RemovePlayer = function(player, Socket){
	
	this.RemoveFromTable(Socket);
	if(this.players[player._id]!=null && this.players[player._id].status == Status.SITTING)
		this.seats_count--;
	if(this.seats_count==0){
		// Distroy this table from Redis and from all
	}
	Socket.broadcast.to(this.id).emit('leaved', {'playerId':player._id});
	
}

table.prototype.RemoveFromTable = function (Socket) {
	Object.keys(Socket.rooms).filter((r) => r != Socket.id)
    .forEach((r) => Socket.leave(r));
}

table.prototype.EngienCllback = function(msg){
	switch(msg.method){
		case 'CollectingMoney':
			CollectMoney(msg)
			break;
	}
}

function CollectMoney(msg){
	var table = this;
	var player = this.players[msg.playerId];
	player.gameData.cash-=msg.cash;
	player.save(function(err){
		//if(err) what should i do?
		io.to(table.id).emit({'position':2, 'money':msg.cash}); // move shared data to all.
  	});
  	
}