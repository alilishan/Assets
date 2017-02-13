
angular
    .module(APP_NAME)
    .factory('WebSocketFactory', ['$rootScope', '$log', '$q', WebSocketFactory]);

function WebSocketFactory($rootScope, $log, $q){
	var factory = {
		onOpen:function(){},
		onClose:function(){},
		onError:function(){},
		onMessage:function(){}
	};
	var SOCKET;
	var RETRY_TIMER = null;

	function createServer(){
		//Clear Timer
		if(typeof RETRY_TIMER == 'number') clearTimeout(RETRY_TIMER);

		//Create New Connection
		SOCKET = new WebSocket(WS_CONST.server);

		SOCKET.onopen = function(){
			var args = arguments;
			factory.open = true;

			$log.info('SOCKET connected ['+WS_CONST.server+']');

			$rootScope.$broadcast('WS-OPENED');
			$rootScope.$apply(function(){
				factory.onOpen.apply(this, args);
			});
		};

		SOCKET.onmessage = function(){
			var args = arguments;

			$rootScope.$apply(function(){
				factory.onMessage.apply(this, args);
			});
		}

		SOCKET.onclose = function(){
			var args = arguments;
			factory.open = false;
			$log.error('SOCKET closed');

			reconnectServer();

			$rootScope.$broadcast('WS-CLOSED');
			$rootScope.$apply(function(){
				factory.onClose.apply(this, args);
			});	
		};

		SOCKET.onerror = function(){
			var args = arguments;
			factory.open = false;

			$rootScope.$apply(function(){
				factory.onError.apply(this, args);
			});
		};

	}

	function reconnectServer(){
		if(WS_CONST.retry_interval && WS_CONST.retry_enabled){
			RETRY_TIMER = setTimeout(function() {
				$log.info('SOCKET reconnecting ['+WS_CONST.server+']');
				createServer();
			}, WS_CONST.retry_interval);
		}
	}

	factory.send = function(data){
		var deferred = $q.defer();

			if(factory.open){
				var msg = typeof(data) == "object" ? JSON.stringify(data) : data;
				//$log.debug(msg);
				
				SOCKET.send(msg);
				deferred.resolve(msg);
			} else {
				deferred.reject();
			}

		return deferred.promise;
	}

	//Initalize
	if(WS_CONST.enabled) {
		createServer();
	} else {
		$log.info('SOCKET Disabled ['+WS_CONST.server+']');
	}

	return factory;
}
