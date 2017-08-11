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
    BLINDS:0,
    HOLE:1,
    BET1:2,
    PLOT:3,
    BET2:4,
    TURN:5,
    BET3:6,
    RIVER:7,
    BET4:8,
    WIN:9,
    START:10
}


function gameEngien(tableCallback, maxSeat, tableId){
	this.id = tableId;
	//this.deck = deck;
	this.callback = tableCallback;
	this.seats = [];
	this.playersInPlay = [];
	this.bigPosition = -1;
	this.smallPositon = -1;
	this.plot = 0;
	this.currentBet = 0;
	this.round = Rounds.BLINDS;
	this.maxSeat = maxSeat;
	this.PrepareList();
	this.inGame = 0;
	this.deck = null;
	this.InPlay = false;
}

/*
    blinds : BIG, SMALL, NONE
    status : MUCK, INPLAY, SITTING, FREE
*/

gameEngien.prototype.AddPlayer = function(player, position, callback) {
    if(this.seats[position] != null && this.seats[position].status == Status.FREE){
        this.seats[position].player = player;
        this.seats[position].status = Status.SITTING;
        this.seats[position].blind = Blinds.NONE;
        this.inGame++;
        //if(this.inGame===1 ){
        //    this.bigPosition = position;
        //}else if(this.inGame === 2){
        //    this.smallPositon =  position;
        //}
        callback({'status':'setting', 'msg':'player in seat '+position,'tableId':this.id})
        if(this.inGame>1 && !this.InPlay){
            this.StartGame();
        }
    }else{
        callback({'status':'err', 'err':'seat already taking'})
    }
}

gameEngien.prototype.StartGame = function(){
    //BigSmallDecision();
    PrepareStartList();
    ResetArgs();
    if(this.InPlay){
        BigSmallDecision();
    }else{
        FirstInit();
    }
    
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

function BigSmallDecision(){
    var cPlaying = this.playersInPlay.size();
    var bigPosition = -1;
    for(var i = 0; i<this.playersInPlay.size(); i++){
        if(this.playersInPlay[i].blind === Blinds.BIG){
            bigPosition = i;
        }
        this.playersInPlay[i].blind = Blinds.NONE;
    }
    
    // TODO THERE ARE PLANTY OF TYPES OF DECISION (if bb left or sb left of any other stat, it should be switch case)

    // new BIG set
    this.playersInPlay[Mod(bigPosition + 1,cPlaying)].blind = Blinds.BIG;
    var bPosition = this.playersInPlay[Mod(bigPosition + 1, cPlaying)].position;
    
    // new SMALL set
    this.playersInPlay[Mod(bigPosition, cPlaying)].blind = Blinds.SMALL;
    var sPosition = this.playersInPlay[Mod(bigPosition, cPlaying)].position;
    
    // new BUTTON
    this.playersInPlay[Mod(bigPosition - 1, cPlaying)].blind = Blinds.BUTTON;
    var buPosition = this.playersInPlay[Mod(bigPosition - 1, cPlaying)].position; 
    

    for(var i = 0 ; i < this.seats.size(); i++){
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
    
    //var table = this;
    //for(var i = this.bigPosition-1; i%(this.maxSeat-1) != this.bigPosition; i=mod(--i, this.maxSeat)){ // bug decides how is the big small position
    //    if(this.seats[i].blind == Blinds.BIG)
    //        throw Error({msg:"there are two big in the table"}) 
    //    if(this.seats[i].player){
    //        this.seats[i].blind = Blinds.SMALL;
    //        this.smallPositon = i;
    //        return;
    //    }
    //}
    //throw Error({msg:"there is only one player in the table"}); 
    //this.players[this.BigPosition].state = 'BIG';
    //this.players[this]
    // x % y>0?x % y:5+x % y;
    // y - playersInPlay.count
    // x - current big possition
}

gameEngien.prototype.RemovePlayer = function(position){
    this.seats[position] = null;
}

function CollectSBBlinds(){
    this.callback({'method':'CollectingMoney', 'playerId':this.seats[this.bigPosition].player._id, 'cash':CollectMoney(400)})
    this.callback({'method':'CollectingMoney', 'playerId':this.seats[this.smallPositon].player._id, 'cash':CollectMoney(200)})
}


function ResetArgs(){
    this.deck = new deck().getDeck();
    this.round = Rounds.BLINDS;
    this.plot = 0;
    this.currentBet = 0; 
}


function ResetList(){ //TODO see how i can delete it
    for(var i = 0; i < this.maxSeat; i++){
        this.seats[i] = null;
    }
}

function PrepareStartList(){
    for(var i = 0; i < this.maxSeat; i++){ // i should fill up players in play list and then decide how is bb how is sb is 2 easy
        if(this.seats[i].player){
            if(this.seats[i].player.gameData.cash!==0){
                this.seats[i].status = Status.INPLAY;
                this.playersInPlay = {'position':i, playerId:this.seats[i].player._id, 'blinds':this.seats[i].blind }
            }else{
                this.seats[i] = null;
                //notify all is out
            }
        }
    }
}

function FirstInit(){
    this.playersInPlay[0].blind = Blinds.SMALL;
    //this.playersInPlay[0].blind = Blinds.BUTTON;// ignore in case of 2 players client will show
    this.seats[this.playersInPlay[0].position].blinds.SMALL;
    this.playersInPlay[1].blind = Blinds.BIG;
    this.seats[this.playersInPlay[1].position].blinds.SMALL;
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
    