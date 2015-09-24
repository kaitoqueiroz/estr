'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
	.directive('headerNotification',function(){
		return {
            templateUrl:'scripts/directives/header/header-notification/header-notification.html',
            restrict: 'E',
            replace: true,
            controller:function($scope,$http){
                $scope.logout = function(){
                    $http.get('/api/usuarios/logout').then(function(result){
                        if(result.data.url != ""){
                            window.location = result.data.url+'/logout';
                        }
                    });
                }
            }
    	}
	});


