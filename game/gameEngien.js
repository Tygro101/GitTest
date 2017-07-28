var uniqid = require("uniqid");
var deck   = require("./deck")().getDeck();

module.exports = gameEngien;


function gameEngien(){
	this.id = uniqid();
	this.deck = deck;
}


gameEngien.prototype.AddPlayer = function(player) {
    
}

gameEngien.prototype.Start = function(){
    
}

gameEngien.prototype.Bet = function(player, bet){
    
}

gameEngien.prototype.Check = function(player){
    
}

gameEngien.prototype.Muck = function(player){
    
}

gameEngien.prototype.AllIn = function(player, cash){
    
}
