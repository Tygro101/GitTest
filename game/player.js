
module.exports = Player;


function Player(Socket, data){
	this.Socket = Socket;
	this._id = data._id;
	this.name = data.facebook.name?data.facebook.name:data.local.username;
	this.profile = {};
	this.cash = 100;
	console.log(this);
}
