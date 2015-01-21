var DBManager = require("./export.js")();

var db_manager = new DBManager("../database/users.db");





db_manager.verify("password", "mypwd", "users", "username", "guest", function(err, result){


	if(result){
			console.log("great");
	} else {
			console.log("not great");
	}

});