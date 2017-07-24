var User = require("./user");

module.exports = dataLayer;


function dataLayer(){ // TODO facebook user

	this.AddUser = function(data, callback){
		User.findOne({'local.username': data.username}, function(err, user){
        	console.log('on datalayer game, data : '+ data + ' ,err : '+err );
			if(err) return callback(err, null);
			if(user) return callback(new Error("Username already exist"), null);
			var newUser = new User();
			newUser.local.username = data.username;
			newUser.gameData.cash = '10000';
			newUser.gameData.xp = '0';
			newUser.gameData.level = 0;
  			newUser.save(function(err){
  				if(err)
  					return callback(err, null);
  				return callback(null, newUser);
  			});
  		});
	}


	this.GetUser = function(_id, callback){ // TODO facebook user
		User.findOne({'_id': _id}, function(err, user){
			if(err) throw callback(err,null);
			if(user) return callback(null,user);
			return callback(new Error("Username is not exist"),null);
		});
	}

	this.GetAllUsers = function(callback){
	    User.find({}, function(err, data){
            callback(data);
        });
	}
}

