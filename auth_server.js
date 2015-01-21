
var WebSocketServer = require('ws').Server
var bodyParser = require('body-parser');
var express = require('express');


//server modules

var DBManager = require("./server_modules/database_manager.js");

db_manager = new DBManager("./database/users.db");


var app = express();
var port     = 80;

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(passport.initialize());



app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {

  	if(!user){ //@TODO validate if (info)
  		user = {
			username: "",
			logged: false,
			message: info.message,
			devices: [],
			servers: []
		};
  	}

	
	console.log(user); 

	res.send(JSON.stringify(user));

  })(req, res, next);
});

/* // No sessions yet.
passport.serializeUser(function(user, done) {

	console.log("serializeUser");
	console.log(user.username);
  	done(null, user.username);

});

passport.deserializeUser(function(username, done) {
	console.log("deserializeUser");
  done(null, { username: username });
});
*/
passport.use(new LocalStrategy(
  function(username, password, done) {

 		var user = {
			username: username,
			logged: false,
			message: "",
			devices: [],
			servers: []
		};


	var on_complete = function(err, user){


		return done(err, user);

	}

	var on_error = function(err){
		return done(err);
	}


  	db_manager.http_authentication(username, password, user, on_complete, on_error);

  	

}));

app.listen(port);

