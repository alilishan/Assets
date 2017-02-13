 

angular
	.module(APP_NAME)
	.directive('rippler', ['$timeout', ripplerEffect]);


function ripplerEffect($timeout){
	return {
		restrict: 'C',
		link: function(scope, element, attrs) {

			var bingRipplerEffect = function(){
				var $element = element;

				$(document).ready(function($) {
					$(element).rippler({
	                    effectClass: 'rippler-effect',
	                    effectSize: 16,
	                    addElement: 'div',
	                    duration: 400
	                });
				});

			}

			$timeout(function() {
				bingRipplerEffect()
			});
		}
	}
}