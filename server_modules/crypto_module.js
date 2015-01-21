var NodeRSA = require('node-rsa');

exports = module.exports = (function(){


  var app = function(database) {
 
  	this.encrypt = function(message){
		
		var encrypted;

			try {

	 			encrypted = JSON.stringify(message) 
	 				
			} catch (e) {
			  // An error has occured, handle it, by e.g. logging it
			  console.log(e);
			}

		return encrypted;

	}

	this.decrypt = function(message){

		var decrypted;

			try {

	 		  decrypted = JSON.parse(message) 

			} catch (e) {
			  // An error has occured, handle it, by e.g. logging it
			  console.log(e);
			}

		return decrypted;

	}

  }
 
  return app;




})();
 

 /*

 
var CryptoModule = function(){

	this.key_hash = [];

	this.generate_keypar = function(foruser){

		var key = new NodeRSA({b: 512});

		this.key_hash[foruser] = key;

		var text = 'Hello RSA!';
		var encrypted = key.encrypt(text, 'base64');
		console.log('encrypted: ', encrypted);
		var decrypted = key.decrypt(encrypted, 'utf8');
		console.log('decrypted: ', decrypted);

		console.log(key.getPrivatePEM()); 
	}

	this.load_key = function(pem_string, foruser){

		var key = new NodeRSA();

		key.loadFromPEM(pem_string);

		this.key_hash[foruser] = key;

	}

	this.get_key = function(foruser){

		return this.key_hash[foruser];

	}



//@TODO not yet, tee hee :P

	this.decrypt = function(foruser){
		//this.key_hash[foruser].
	}

	this.encrypt = function(foruser){

	} 


	 

}
*/