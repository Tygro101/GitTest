var uniqid = require("uniqid");
var deck   = require("./deck")().getDeck();

module.exports = gameEngien;


function gameEngien(tableCallback){
	this.id = uniqid();
	this.deck = deck;
	this.callback = tableCallback;
	this.players = [];
	this.playersInPlay = [];
	this.BigPosition = 0;
	this.plot = 0;
	this.currentBet = 0;
}

/*
    blinds : BIG, SMALL, NONE
    status : MUCK, INPLAY
*/

gameEngien.prototype.AddPlayer = function(player) {
    this.players.push({'player':player,'blind':'none', 'status':'check'});
}

gameEngien.prototype.StartGame = function(){
    /*TODO 
        1. Reset needed vars, start of state 3
        2. manage rounds? reset currentBet every round
        3. Decide who is the smal and big bets, then add all playes that have enough money to be small or big
        4. Take from smal and big bets the money.
        5. Start timets https://nodejs.org/en/docs/guides/timers-in-node/
        
    
    */
}

gameEngien.prototype.Bet = function(player, bet){
    
}

gameEngien.prototype.Check = function(player){
    
}

gameEngien.prototype.Muck = function(player){
    // set status faled to player then 
}

gameEngien.prototype.AllIn = function(player, cash){
    
}


gameEngien.prototype.BigSmallDecision = function(){
    //this.players[this.BigPosition].state = 'BIG';
    //this.players[this]
    // x % y>0?x % y:5+x % y;
    // y - playersInPlay.count
    // x - current big possition
}



