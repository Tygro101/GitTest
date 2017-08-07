module.exports = function(io, game) {
	io.on('connection', function(socket){
    	console.log("a user as connected, Socket : " + socket.id); 
    	socket.on('disconnect', function(){
            game.SingoutPlayer(socket);
    		console.log("a user as disconnected, Socket : " + socket.id); 
    	});


        /*
        Singup data: 
            
        */
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
            game.Login(socket, msg._id, function(err, data){
                if(err){
                    socket.emit('on-error', err);
                }
                else{
                    console.log('User : '+ data.user.local.username +' just loged-in');
                    socket.emit('loged-in', data);                    
                }
            });
        });


        /* join table expected values : 
         user
            _id
            ..
        tableId
         */
        socket.on('join-table', function(msg) { 
            game.JoinTable(socket, msg, function(msg){
                socket.emit('joined', msg);
            });
        });
                /* join table expected values : 
         user
            _id
            ..
        seatLocation
         */
        socket.on('pick-a-seat', function(msg) {
            game.PickASeat(socket, msg, function(msg){
                socket.emit('sitting', msg);
            });
        });        

        //socket.on('dec', function(msg) {
        //    game.dicrece(socket, function(err, data){
        //    });
        //});
    });
}