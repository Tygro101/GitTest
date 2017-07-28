var uniqid = require("uniqid");
// add game engien with callback contract
module.exports = table;


function table(){
	this.id = uniqid();
	this.players = {};
	this.seats_count = 0;
	this.blind = 0;
	this.maxByIn = 0;
	return this.id;
}


table.prototype.getMaxByIn = function(){
	return this.maxByIn;
}

table.prototype.AddPlayer = function(player, Socket, callback) {
	var table = this;
	this.players[player._id] = {player, 'socket':Socket};
	this.AssignListeners(Socket, function(){
		this.seats_count++;
		callback({'added':true, 'tableId':table.id});
	});
}

table.prototype.AssignListeners = function(Socket,callback){
	Socket.join(this.id);
	Socket.on('muck', function(msg){
		Socket.broadcast.to('').emit('muck', {'playerId':msg.id});
	});
	
	Socket.on('check', function(msg){
		Socket.broadcast.to(this.id).emit('check', {'playerId':msg.id});
	});
	
	Socket.on('raise', function(msg) {
	    Socket.broadcast.to(this.id).emit('raise', {'playerId':msg.id, 'rase':msg.rase});
	})
	
	callback();
}

table.prototype.RemovePlayer = function(player, Socket){
	console.log('in table remove');
	console.log(player);
	this.RemoveFromTable(Socket);
	this.seats_count--;
	Socket.broadcast.to(this.id).emit('leaved', {'playerId':player._id});
	
}

table.prototype.RemoveFromTable = function (Socket) {
	Object.keys(Socket.rooms).filter((r) => r != Socket.id)
    .forEach((r) => Socket.leave(r));
}