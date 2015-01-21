var sqlite3 = require('sqlite3').verbose();

exports = module.exports = (function(){


  var app = function(database) {
 

	var quote = function(value){

		return "'" + value + "'";
	}

	var construct_select = function(field, table, condition){

		if(condition){
			return "SELECT " + field + " FROM " + table + " WHERE " + condition;
		} else {
			return "SELECT " + field + " FROM " + table;
		}
	}


	var db = new sqlite3.Database(database);



	var find = function(what, to_find, from_table, on_complete, on_error){

		var cond_field = what;
		var cond_type  = " = ";
		var cond_value = quote(to_find);

		var condition = cond_field + cond_type + cond_value;

		var stm = construct_select(what, from_table, condition);


		db.get(stm, function(err, row) {

			if(err){
				on_error(err);
			} else {

	    		if (!row){
	 				
	 				on_complete(false);

	     		} else {

	     			on_complete(true);
	    		}

			}

		});

	}

	var verify = function(what, to_verify, from_table, condition_field, condition_value, on_complete, on_error){

		var cond_field = condition_field;
		var cond_type  = " = ";
		var cond_value = quote(condition_value);

		var condition = cond_field + cond_type + cond_value;

		var stm = construct_select(what, from_table, condition);


		db.get(stm, function(err, row) {
    		
			if(err){
				on_error(err);
			} else {

	    		if (!row){
	 				
	 				on_complete(false);

	     		} else if (row[what] !== to_verify) {

	     			on_complete(false);

	    		} else{

	    			on_complete(true);

	    		}

			}

		});
 
	}

	var get_foruser = function(what, from_table, for_username, storage, on_complete, on_error){

		var cond_field = "username";
		var cond_type  = " = ";
		var cond_value = quote(for_username);

		var condition = cond_field + cond_type + cond_value;

		var stm = construct_select(what, from_table, condition);


		db.each(stm, function(err, row) {

			if(err){
				on_error(err);

			} else{

	    		storage.push(row[what]);

			}


		}, function(err, rows){

			if(err){
				on_error(err);
			} else {

			  if (rows == 0) {
			  	storage.push("No devices");
			  }

			  on_complete(storage);

			}




		});


	}

	var get = function(what, from_table, storage, on_complete, on_error){


		var stm = construct_select(what, from_table);


		db.each(stm, function(err, row) {
    		
			if(err){
				on_error(err);
			} else{

	    		storage.push(row[what]);

			}

		}, function(err, rows){

			if(err){
				on_error(err);
			} else {
				
				if (rows == 0) {
				  	storage.push("No " + from_table);
				}

				on_complete(storage);

			}

		});
	}

	

	this.http_authentication = function(username, password, httpuser, on_complete, on_error){

		
		var http_on_complete = function(message, user){

			user.message = message;

			on_complete(null, user);

		} 

		var http_on_error = function(err){
			on_error(err);
		}

		var http_on_servers_got = function(servers){

			httpuser.logged = true;

			httpuser.servers = servers;

			http_on_complete("Login successful", httpuser);

		}

		var http_on_devices_got = function(devices){

			httpuser.devices = devices; 				

  			get("address", "servers", [], http_on_servers_got, http_on_error);

		}

		var http_on_verified = function(verified){

	 
			if(verified){

				get_foruser("device", "devices", username, [], http_on_devices_got, http_on_error);	  	

  			} else {

				http_on_complete("Wrong password", httpuser);			 
  			} 
		}


		var http_on_found = function(found){


			if(found){

			   verify("password", password, 
						  "users", "username", 
						  username, http_on_verified, http_on_error);

			} else{

				http_on_complete("Wrong username", httpuser);

			}

		}


		find("username", username, "users", http_on_found, http_on_error);



	}

	this.ws_authentication = function(username, password, field, table, on_complete){

		
		var ws_on_complete = function(logged, message){

			on_complete(logged, message);

		} 

		var ws_on_error = function(err){
 
			on_complete(false, err);
 		} 

		var ws_on_verified = function(verified){

	 
			if(verified){
				ws_on_complete(true, "Login successful");
 
  			} else {

				ws_on_complete(false, "Wrong password");			 
  			} 
		}


		var ws_on_found = function(found){


			if(found){

			   verify("password", password, 
						  table, field, 
						  username, ws_on_verified, ws_on_error);

			} else{

				ws_on_complete(false, "Wrong username");

			}

		}


		find(field, username, table, ws_on_found, ws_on_error);



	}
 
 
	this.register = function(what, to_register, with_password, in_table){


	}

	this.register = function(what, to_register, for_user, in_table, registration_id){

	}

	this.remove = function(what, to_remove, from_table){

	}

  }
 
  return app;




})();
 

 