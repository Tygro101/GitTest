var uniqid = require("uniqid");
// add game engien with callback contract
// TODO add key of steatcount+blind and table id + server name + server port

var gameEngien = require("gameEngien");

var Status = {
	WATCHER : 1,
	SITTING : 2
}

module.exports = table;


function table(){// add distroy callback from lobby
	this.id = uniqid();
	this.players = {};
	this.seats_count = 0;
	this.blind = 0;
	this.maxByIn = 0;
	this.game = new gameEngien();
	return this.id;
}


table.prototype.getMaxByIn = function(){
	return this.maxByIn;
}

table.prototype.AddPlayer = function(player, Socket, callback) { 
	var table = this;
	Socket.join(table.id);
	this.players[player._id] = {player, 'socket':Socket, 'status':Status.WATCHER};
	callback({'added':true, 'tableId':table.id})
}


table.prototype.PickSeat = function(player, Socket, seatLocation, callback) {
	var tablePlayer = this.players[player._id]
	tablePlayer.status = Status.SITTING;
	this.AssignListeners(Socket, function(){
		this.seats_count++;
		callback();
	});
}

table.prototype.AssignListeners = function(Socket,callback){
	Socket.join(this.id);
	Socket.on('muck', function(msg){
		Socket.broadcast.emit('muck', {'playerId':msg.id});
	});
	
	Socket.on('check', function(msg){
		Socket.broadcast.emit('check', {'playerId':msg.id});
	});
	
	Socket.on('raise', function(msg) {
	    Socket.broadcast.emit('raise', {'playerId':msg.id, 'rase':msg.rase});
	})
	
	callback();
}

table.prototype.RemovePlayer = function(player, Socket){
	console.log(player);
	//Socket.leave(this.id);
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