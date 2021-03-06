var uniqid = require("uniqid");
var deck   = require("./deck");

module.exports = gameEngien;

var Status = { 
    SITTING : 0,
    INPLAY: 1,
    MUCK : 2, 
    FREE : 3
}

var Blinds = {
    BIG : 0,
    SMALL : 1,
    BUTTON:2,
    NONE : 3
}

var Rounds = {
    START:0,
    BLINDS:1,
    HOLE:2,
    BET1:3,
    PLOT:4,
    BET2:5,
    TURN:6,
    BET3:7,
    RIVER:8,
    BET4:9,
    WIN:10
}


function gameEngien(tableCallback, maxSeat, tableId, io){
	this.id = tableId;
	this.io = io; // TODO Critical move this to lobby there is no need to duplicate this massive value every table
	//this.deck = deck;
	this.callback = tableCallback;
	this.seats = [];
	this.playersInPlay = [];
	this.bigPosition = -1;
	this.smallPositon = -1;
	this.buttonPosition = -1;
	this.plot = 0;
	this.currentBet = 0;
	this.round = Rounds.BLINDS;
	this.maxSeat = maxSeat;
	this.inGame = 0;
	this.deck = null;
	this.InPlay = false;
	this.gameRound = Rounds.START;
	
	this.preaperList();
}

/*
    blinds : BIG, SMALL, NONE
    status : MUCK, INPLAY, SITTING, FREE
*/

gameEngien.prototype.AddPlayer = function(player, Socket, position, callback) {
    if(this.seats[position].status == Status.FREE){// && this.seats[position].status == Status.FREE){
        this.seats[position].player = player;
        this.seats[position].status = Status.SITTING;
        this.seats[position].blind = Blinds.NONE;
        this.seats[position].Socket = Socket;
        this.inGame++;
        callback({'status':'setting', 'msg':'player in seat '+position,'tableId':this.id})
        if(this.inGame>1 && !this.InPlay){
            this.DeployRound(this);
        }
    }else{
        callback({'status':'err', 'err':'seat already taking'})
    }
}



gameEngien.prototype.StartGame = function(){
    this.PrepareStartList();
    this.ResetArgs();
    this.gameRound = Rounds.BLINDS;

    
    
    /*TODO 
    
        1. Reset needed vars, start of state 3
        2. manage rounds? reset currentBet every round
        3. Decide who is the smal and big bets, then add all playes that have enough money to be small or big
            °if SB and BB are equal to -1 then the first seat from 1-maxSeats is bb and the oter is smal blind but this is only if the table head minimum of 
            °no round one acording to the ruls and then rever turn middle and harta
        4. Take from smal and big bets the money.
        5. Start timets https://nodejs.org/en/docs/guides/timers-in-node/
        6. must decide how to exclude players how have no money
        7. the cash should be by in cash
        
        
    
    */
}

gameEngien.prototype.Bet = function(position, bet){
    
}

gameEngien.prototype.Check = function(position){
    
}

gameEngien.prototype.Muck = function(position){
    // set status faled to player then 
}

gameEngien.prototype.AllIn = function(position, cash){
    
}

gameEngien.prototype.RemovePlayer = function(position){
    this.seats[position] = {status:Status.FREE};
}


gameEngien.prototype.preaperList = function(){
    for(var i = 0; i < this.maxSeat; i++){
        this.seats[i] = {status:Status.FREE};
    }
}


gameEngien.prototype.PrepareStartList = function(){
    var PIP = 0;
    for(var i = 0; i < this.maxSeat; i++){ // i should fill up players in play list and then decide how is bb how is sb is 2 easy
        if(this.seats[i].player){
            if(this.seats[i].player.gameData.cash!==0){
                this.seats[i].status = Status.INPLAY;
                this.playersInPlay[PIP++] = {'position':i, playerId:this.seats[i].player._id, 'blind':this.seats[i].blind }
            }else{
                this.seats[i] = {status:Status.FREE};
                //notify all is out
            }
        }
    }
}

gameEngien.prototype.DeployRound = function(context){
    switch(context.gameRound){
        case Rounds.START:  
            
            context.StartGame();
            context.DeployRound(context);
            break;
            
        case Rounds.BLINDS: 
            
            context.BigSmallMethod();
            context.DeployRound(context);
            break;
            
        case Rounds.HOLE:   
            
            context.FirstTwoCards();
            setTimeout(context.DeployRound, 1000, context);
            
            break;
        case Rounds.BET1:   
            break;
        case Rounds.PLOT:   
            break;
        case Rounds.BET2:   
            break;
        case Rounds.TURN:   
            break;
        case Rounds.BET3:   
            break;
        case Rounds.RIVER:  
            break;
        case Rounds.BET4:   
            break;
        case Rounds.WIN:    
            break;
    }
}



//----- Game States ------//

gameEngien.prototype.BigSmallMethod = function(){
    if(this.InPlay){
            this.BigSmallDecision();
    }else{
            this.FirstInit();
    }
    this.CollectSBBlinds();
}

gameEngien.prototype.FirstInit = function(){
    this.playersInPlay[0].blind = Blinds.SMALL;
    var pp = this.playersInPlay[0];
    //this.playersInPlay[0].blind = Blinds.BUTTON;// ignore in case of 2 players client will show
    this.seats[this.playersInPlay[0].position].blind = Blinds.SMALL;
    this.playersInPlay[1].blind = Blinds.BIG;
    this.seats[this.playersInPlay[1].position].blind = Blinds.BIG;
    this.bigPosition = this.playersInPlay[1].position;
    this.smallPositon = this.playersInPlay[0].position;
    this.buttonPosition = this.playersInPlay[0].position;
    this.InPlay = true;
}


gameEngien.prototype.BigSmallDecision = function(){
    var cPlaying = this.playersInPlay.length;
    var bigPosition = -1;
    for(var i = 0; i<this.playersInPlay.length; i++){
        if(this.playersInPlay[i].blind == Blinds.BIG){
            bigPosition = i;
        }
        this.playersInPlay[i].blind = Blinds.NONE;
    }
    
    // TODO THERE ARE PLANTY OF TYPES OF DECISION (if bb left or sb left of any other stat, it should be switch case)

    // new BIG set
    this.playersInPlay[Mod(bigPosition + 1,cPlaying)].blind = Blinds.BIG;
    var bPosition = this.playersInPlay[Mod(bigPosition + 1, cPlaying)].position;
    this.bigPosition = bPosition; // todo remove it to bposition init
    
    // new SMALL set
    this.playersInPlay[Mod(bigPosition, cPlaying)].blind = Blinds.SMALL;
    var sPosition = this.playersInPlay[Mod(bigPosition, cPlaying)].position;
    this.smallPositon = sPosition;// todo remove it to bposition init
    
    
    // new BUTTON
    this.playersInPlay[Mod(bigPosition - 1, cPlaying)].blind = Blinds.BUTTON;
    var buPosition = this.playersInPlay[Mod(bigPosition - 1, cPlaying)].position; 
    this.buttonPosition = buPosition;// todo remove it to bposition init
    

    for(var i = 0 ; i < this.seats.length; i++){
        if(this.seats[i]){
            switch(i){
                case bPosition:
                    this.seats[i].blind = Blinds.BIG;
                    break;
                case sPosition:
                    this.seats[i].blind = Blinds.SMALL;
                    break;
                case buPosition:
                    this.seats[i].blind = Blinds.BUTTON;
                    break;
                default:
                     this.seats[i].blind = Blinds.NONE;
                    break;
            }
        }
    }
}

gameEngien.prototype.FirstTwoCards = function(){
    for(var i = 0; i< this.playersInPlay.length; i++){
        var hand = this.deck.draw(2);
        this.seats[this.playersInPlay[i].position].Socket.emit('hand',{'hand':hand});
        this.playersInPlay[i].hand = hand;
    }
    this.gameRound = Rounds.START;//Rounds.BET1;
}


gameEngien.prototype.CollectSBBlinds = function(){
    var bbPlayer = this.seats[this.bigPosition].player;
    if(bbPlayer == undefined)
        console.log("");
    //bbPlayer.gameData.cash -= 400; //TODO change it to BB
    //bbPlayer.save(function(err){
    //    
    //});
    this.io.to(this.id).emit('gamecall',{method:'BB', playerId:bbPlayer._id});
    
    var sbPlayer = this.seats[this.smallPositon].player;
    //sbPlayer.gameData.cash -= 200; //TODO change it to BB
    //sbPlayer.save(function(err){
    //    
    //});   
    this.io.to(this.id).emit('gamecall',{method:'SB', playerId:sbPlayer._id});
    
    this.gameRound = Rounds.HOLE;
    
    //console.log(sbPlayer.gameData.cash);
    //console.log(bbPlayer.gameData.cash);
}


gameEngien.prototype.ResetArgs = function(){
    this.deck = new deck().getDeck();
    this.round = Rounds.BLINDS;
    this.plot = 0;
    this.currentBet = 0; 
}





function Mod(position, base) {
    return position - (base * Math.floor(position/base));
}


function CollectMoney(cash, collected){
    return cash-collected<0 ? cash : collected;
}


/* player attr
    _id
    gameData
        cash
        xp 
        level
*/
    