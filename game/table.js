
module.exports = table;


function table(id){
	this.id = id;
	this.players = {};
	this.seats_count = 0;
	this.blind = 0;
	this.maxByIn = 0;	
}


table.prototype.getMaxByIn = function(){
	return this.maxByIn;
}

table.prototype.AddPlayer = function(player, Socket, callback) {
	this.players[player._id] = {player, 'socket':Socket};
	this.AssignListeners(Socket);
	callback({'added':true, 'tableId':this.id});
}

table.prototype.AssignListeners = function(Socket){
	Socket.on('check', function(msg){
		
	});
	
	Socket.on('muck', function(msg){
		
	});
	
	Socket.on('raise', function(msg) {
	    
	})
}