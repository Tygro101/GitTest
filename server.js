var express  = require("express");
var morgan   = require("morgan");
var cookieParser = require("cookie-parser");
var session  = require("express-session");

var app      = express();

var http = require("http").Server(app);
var io   = require("socket.io")(http);
var socketioRedis = require('socket.io-redis');
var redisConfig = require("./config/redisConfig");

var port = '8080'||process.env.PORT;
var path = require("path");

//DB
var mongoose = require("mongoose");
var dbConfig = require("./config/database.js");

var game  = require('./game/game');
var dataLayer = require('./models/dataLayer');
var cash = require('./game/cash');

mongoose.Promise = Promise;
mongoose.connect(dbConfig.url,dbConfig.options);

//Routes api

var bodyParser = require("body-parser");

app.use(bodyParser({
  extended: true
}));

//app.use(morgan('dev'));

app.use(cookieParser());
app.use(session({secret:"anystringoftext", 
                 saveUninitialized:true,
                 resave: true
}));

var api = express.Router();
require("./routes/api")(api);
app.use("/api",api); 

// Test 
//app.get('/', function(req, res){
//	res.sendFile(__dirname + '/game/index.html');
//})

app.get('/', function(req, res){
	res.sendFile(__dirname + '/game/newIndex.html');
})

app.get('/users', function(req, res){
	new dataLayer().GetAllUsers(function(data){
		res.json(data);
	})
})
//

io.adapter(socketioRedis({host: redisConfig.redis_host, port: redisConfig.redis_port}));

require("./services/Socket")(io, new game(new dataLayer(), new cash(), io));



http.listen(port, function(err){
    if(err)
        console.log("server error");
    console.log("server are runing on port : " + port);
})
