var WebSocketServer = require('ws').Server
var DBManager = require("./server_modules/database_manager.js");
var CryptoModule = require("./server_modules/crypto_module.js");

var WSServer = function(ws_port){ 

		var db_manager = new DBManager("./database/users.db");
		var crypto_module = new CryptoModule(); 
		var wss = new WebSocketServer({port: ws_port});
		
		var ws_pool = []; 
		
		var ws_message_type = {
			login: 0
		} 

 
		var send = function(ws, message){

			try {

 				ws.send(crypto_module.encrypt(message));
 
			} catch (e) {
			  	// An error has occured, handle it, by e.g. logging it
			  	console.log(e);
			}
		}

		var redirect = function(message){ 

			try {

	 			ws_pool[message.data.destination].
	 			send(crypto_module.encrypt(message));

			} catch (e) {
			  	// An error has occured, handle it, by e.g. logging it
			  	console.log(e);
			}
 
	 	}
	 	
	 	var handle_login = function (web_socket, request){

 	
			var data = {
				logged: false,
				message: ""
			};

			var response = {
				ws_message_type: ws_message_type.login,
				data: data
			};

			var field = request.data.id === "station" ? "username" : "device"; 
			var table = request.data.id === "station" ? "users" : "devices";
			var username = request.data.name;
			var password = request.data.password;

			var ws_id = request.data.name;
			
 			var on_auth_done = function(logged, message){

	  			response.data.logged = logged;
	  			response.data.message = message;

	  			console.log(request.data.name);
	  			ws_pool[ws_id] = web_socket;
	  			web_socket.authenticated = logged;

  				send(web_socket, response);
			}

			db_manager.ws_authentication(username, password, field, table, on_auth_done);

	 	}

		wss.on('connection', function(ws) {
 			
			ws.authenticated = false;

		    ws.on('message', function(message) {

		    	var parsed_message;

	    	    parsed_message = crypto_module.decrypt(message);

	    	    console.log(parsed_message);
	    	    console.log(ws.authenticated);

				if(!ws.authenticated){
					console.log("hit");
					handle_login(ws, parsed_message); 
					
		    	} else {

		    		parsed_message.data.origin = ws.upgradeReq.connection.remoteAddress;
		    		redirect(parsed_message); 

				}

		    });
		});

}


var network_manager = new WSServer(9580);