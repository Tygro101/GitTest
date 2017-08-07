var uniqid = require("uniqid");
var deck   = require("./deck");

module.exports = gameEngien;

var Status = { 
    SITTING : 0,
    INPLAY: 1,
    MUCK : 2, 
    FREE : 3
}


function gameEngien(tableCallback, maxSeat, tableId){
	this.id = tableId;
	this.deck = deck;
	this.callback = tableCallback;
	this.seats = [];
	this.playersInPlay = [];
	this.BigPosition = 0;
	this.plot = 0;
	this.currentBet = 0;
	this.maxSeat = maxSeat;
	this.PrepareList();
	this.inGame = 0;
	this.deck = new deck().getDeck();
}

/*
    blinds : BIG, SMALL, NONE
    status : MUCK, INPLAY, SITTING, FREE
*/

gameEngien.prototype.AddPlayer = function(player, position, callback) {
    if(this.seats[position] != null && this.seats[position].status == Status.FREE){
        this.seats[position].player = player;
        this.seats[position].status = Status.SITTING;
        this.inGame++;
        callback({'status':'setting', 'msg':'player in seat '+position,'tableId':this.id})
        if(this.inGame>1){
            // starttt!!
        }
    }else{
        callback({'status':'err', 'err':'seat already taking'})
    }
}

gameEngien.prototype.StartGame = function(){
    /*TODO 
        1. Reset needed vars, start of state 3
        2. manage rounds? reset currentBet every round
        3. Decide who is the smal and big bets, then add all playes that have enough money to be small or big
            °if SB and BB are equal to -1 then the first seat from 1-maxSeats is bb and the oter is smal blind but this is only if the table head minimum of 
            °no round one acording to the ruls and then rever turn middle and harta
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

gameEngien.prototype.RemovePlayer = function(position){
    this.seats[position].player = 'none';
    this.seats[position].status = Status.FREE;
}


gameEngien.prototype.PrepareList = function(){
    for(var i = 0; i < this.maxSeat; i++){
        this.seats[i] = {'player':'none', 'status' : Status.FREE};
    }
}



