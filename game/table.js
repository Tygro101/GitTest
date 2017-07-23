
module.exports = table;


function table(){
	console.log('in table');
	this.players = {};
	this.seats_count = 0;
	this.blind = 0;
	this.maxByIn = 0;	
}


table.prototype.getMaxByIn = function(){
	return this.maxByIn;
}