
//https://github.com/iconic/SVGInjector
//http://webdesign.tutsplus.com/articles/manipulating-svg-icons-with-simple-css--webdesign-15694
angular
	.module(APP_NAME)
	.directive('injectSvg', ['$timeout', svgInject]);



function svgInject($timeout){
	return {
		restrict: 'C',
		link: function(scope, element, attrs){

			function bindUI(){
				$(document).ready(function($) {
					
					//SVG INGECTOR;
					//console.log(element[0])
					SVGInjector(element[0]);

				});
			}

			$timeout(function(){
				bindUI();
			}, 0);
			
		}
	}
}