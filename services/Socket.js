module.exports = function(io, game) {
	io.on('connection', function(socket){
    	console.log("a user as connected, Socket : " + socket.id); 
    	socket.on('disconnect', function(){
            game.SingoutPlayer(socket);
    		console.log("a user as disconnected, Socket : " + socket.id); 
    	});

    	socket.on('signup', function(msg) {
    		game.Signup(socket, msg, function(err, data){
                console.log('on socket callback, data : '+data + ' ,err : '+err);
                console.log(data);
                if(err)
                    socket.emit('on-error', err);
                else
                    socket.emit('signed', data);
            });
    	})

        socket.on('login', function(msg) {
            game.Login(socket, msg, function(err, data){
                if(err){
                    console.log(err);
                    socket.emit('on-error', err);
                }
                else{
                    console.log('User : '+ data.user.local.username +' just loged-in');
                    socket.emit('loged-in', data);                    
                }
            });
        });


        socket.on('dec', function(msg) {
            game.dicrece(socket, function(err, data){
            });
        });
    });
}