
//Initialize Application 
angular
    .module('Socket.Module', [])
    .factory('OunchSocket', ['$rootScope', '$timeout', function($rootScope, $timeout){

    	let SOCKET,
    		isOPEN = false,
    		REGISTERED = false,
    		FACTORY = {};

		FACTORY.Connect = (server, type, hardware_id) => {
			console.log('Socket Status: Connecting ... [', server, ' -> ', type, ' -> ', hardware_id, ']');

			SOCKET = new WebSocket(server);

			SOCKET.onopen = () => {
				var args = arguments;
				isOPEN = true;
				
				console.log('Socket Status: Connected');

		        var message = JSON.stringify({
					action: 'REGISTER', 
					channel: '1234', 
					type: type, 
					message: 'This is a REGISTER message.',
					hw_id: hardware_id
				});


				//Send Authentication
				$timeout(() => {
					SOCKET.send(JSON.stringify({
						hardwareId: hardware_id,
						message: Base64.encode(message)
					}));
	            }, 500);


				//Bind Event
				if(typeof FACTORY.onOpen == 'function'){
		            $rootScope.$apply(() => {
						FACTORY.onOpen( SOCKET, args );
					});
				}

			}


	        SOCKET.onmessage = (e) => {
				var args = arguments;

				// console.log(args);

				if(!REGISTERED){
					var decodedMessage = Base64.decode(e.data.trim());
					var jsonObj = JSON.parse(decodedMessage);

					if(jsonObj.status == 'CONNECTED'){
						REGISTERED = true;

						console.log('Socket Status: REGISTERED');

						//Bind Event
						if(typeof FACTORY.onRegister == 'function'){
				            $rootScope.$apply(() => {
								FACTORY.onRegister( SOCKET, args );
							});
						}
					}
					
				} else {

					//Bind Event
					if(typeof FACTORY.onMessage == 'function'){
			            $rootScope.$apply(() => {
							FACTORY.onMessage(e, args);
						});
					}
				}

	        }


	        SOCKET.onerror = function(){
	        	REGISTERED = false;
	        	isOPEN = false;
	        	var args = arguments;
	        	console.log('Socket Status: ERROR');

				if(typeof FACTORY.onError == 'function'){
		            $rootScope.$apply(() => {
						FACTORY.onError( SOCKET, args );
					});
				}
	        }


	        SOCKET.onclose = function(){
	        	REGISTERED = false;
	        	isOPEN = false;
	        	var args = arguments;
	        	console.log('Socket Status: CLOSE');

				if(typeof FACTORY.onClose == 'function'){
		            $rootScope.$apply(() => {
						FACTORY.onClose( SOCKET, args );
					});
				}
	        }


		} //END FAC


		FACTORY.Send = (data) => {
			if(isOPEN){
				console.log(data);
				SOCKET.send(Base64.encode(JSON.stringify(data)));
			} else {
				console.log('ERROR SENDING MESSAGE');
			}
		}


    	return FACTORY;

    }]);




// Base64 Object
//	 https://gist.github.com/ncerminara/11257943

if(typeof Base64 == 'undefined'){
	var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
}

/*
Usage  
	var decodedString = Base64.decode(encodedString); 
	var encodedString = Base64.encode(string);
*/	
