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
            controller:function($scope,$http,$state){
                $scope.logout = function(){
                    $http.get('/logout').then(function(result){
                        $state.go("login");
                    });
                }
            }
    	}
	});


