
//Initialize Application 
angular
    .module('Upload.Module', [])
    .directive('ounchUploadInput', ['$timeout', OunchUploadFileInout])
	.directive('ounchUploadDropzone', OunchUploadDropzone)
    .factory('OunchUpload', ['$rootScope', '$timeout', '$q', '$http', function($rootScope, $timeout, $q, $http){

    	let FACTORY = {};

    	FACTORY.Upload = function(url, file, id) {
			var deferred = $q.defer(),
				xhr = new XMLHttpRequest(),
				upload = xhr.upload;
				
				upload.addEventListener('progress', function(event){
					if (event.lengthComputable) {
						var complete = (event.loaded / event.total * 100 | 0);
						deferred.notify({id: id, complete:complete}); 
					}
				}, false);

				xhr.onreadystatechange = function(r) { 
					if (4 === this.readyState) {
						if (xhr.status == 200) {
							$rootScope.$apply(function() {
								deferred.resolve({id: id, data:JSON.parse(xhr.response)});  
							});
						} else {
							$rootScope.$apply(function() {
								deferred.reject({id: id, data:JSON.parse(xhr.response)});  
							});
						}
					}
				}

			try	{
				xhr.open("POST", url, true);
				xhr.setRequestHeader("X-FILENAME", file.name);
				xhr.send(file);
			} catch(e) {
				deferred.reject({id: id, data:{id: id, message: 'XHR Error. Check Console'}});
				console.log(e);
			}


			return deferred.promise;
		};

    	return FACTORY;

    }]);



function OunchUploadFileInout($timeout){
	return {
		restrict: 'A',
		scope: {
			ngMultiple: '=',
			onChange: '&'
		},
		link: function(scope, element, attrs){

			function bindOunchFileInput(){
				element.on('change', function(event){
					event.preventDefault();
					var files = (event.target.files !== undefined) ? event.target.files : (event.target.value ? { name: event.target.value.replace(/^.+\\/, '') } : null);	
						// console.log(event, files);
					scope.onChange({files: files});	
				});

				scope.$watch('ngMultiple', function(newVal, oldVal){
					if(newVal){
						element.attr('multiple', '');
					}
				}, true);

				scope.$on('FILEUPLOAD-CLOSED', function(){
					setTimeout(function() {
						element.val('');
					}, 1000);	
				});
			}

			$timeout(function(){
				bindOunchFileInput();
			}, 0);
			
		}
	}
}


function OunchUploadDropzone(){
	return {
		restrict: 'A',
		scope: {
			ngMultiple: '=',
			onChange: '&'
		},
		link: function(scope, element, attrs){

			var support = (window.File && window.FileReader && window.FileList && window.Blob) ? true : false;

			if(!support){
				element.addClass('no-drop-support');
			} else {
 
			$(window)
				.draghover()
				.on({'draghoverstart': function() {
						$('body').addClass('on-drop-hover');
					}, 'draghoverend': function() {
						$('body').removeClass('on-drop-hover');
					}
				});

				$('body')
					.on('dragover', function(ev) { return false; })
					.on('drop', function(ev) {
						$('body').removeClass('on-drop-hover');
						var dt = ev.originalEvent.dataTransfer;
						if(dt){
							//console.log(dt.files);
							var files = (dt.files !== undefined) ? dt.files : (e.target.value ? { name: e.target.value.replace(/^.+\\/, '') } : null);
							scope.onChange({files: files});	
						}
						return false;
					});
			}
		}
	}
}


//https://gist.github.com/meleyal/3794126
$.fn.draghover = function(options) {
  return this.each(function() {

    var collection = $(),
        self = $(this);

    self.on('dragenter', function(e) {
      if (collection.length === 0) {
        self.trigger('draghoverstart');
      }
      collection = collection.add(e.target);
    });

    self.on('dragleave drop', function(e) {
      collection = collection.not(e.target);
      if (collection.length === 0) {
        self.trigger('draghoverend');
      }
    });
  });
};
