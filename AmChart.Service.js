
/* AmChart Module 
    Require:
        jQuery
*/

angular
    .module('AmChart.Module', [])
    .directive('amChart', ['$rootScope', '$timeout', function($rootScope, $timeout){
    	return {
    		restrict: 'E',

    		scope: {
    			config: '=',
                onRender: '&'
    		},

    		template: function(){
                var template = '<div id="{{id}}" class="charts--am">';
                        template += '<div id="amchart_{{id}}" style="min-width: 310px; height: {{chart.height}}px; margin: 0 auto; overflow: auto;"></div>';
                        template += '<div class="charts--curtain"></div>';
                    template += '</div>';

                return template;
            },

    		link: function(scope, element, attrs){
    			
                scope.chart = false;
                scope.id = scope.$id +'_'+ Math.floor(50*Math.random())+""+(new Date).getTime();

    			function bindAmchart(){

    				if(scope.chart) scope.chart.clear();
    				scope.chart = AmCharts.makeChart('amchart_'+scope.id, scope.config);

					scope.chart.addListener('init', function(obj){
						$('.amcharts-chart-div > a').css('opacity', 0).remove();
                        $('.amcharts-chart-div').find('a[href="http://www.amcharts.com/javascript-charts/"]').remove();
                        $('.amcharts-chart-div').find('a[href="http://www.amcharts.com"]').remove();
					});

                    scope.chart.addListener('rendered', function(){
                        var $curtain = $('#' + scope.id).find('.charts--curtain');

                        if(scope.onRender){
                            scope.chart.$curtain = $curtain;
                            scope.onRender({chart: scope.chart});
                        } else {
                            $curtain.remove();
                        }
                    });

    			}

    			scope.$on("$destroy", function () {
					if(scope.chart) scope.chart.destroy();
		        });

				$timeout(function(){
					bindAmchart();
				}, 0);

    		}
    	}

    }]);