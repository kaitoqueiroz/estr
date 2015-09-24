'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp').controller('MainCtrl', function($scope,$state,$rootScope,$http,$location,sincronizarService) {
    if($state.current.name == 'dashboard'){		
    	$state.go("dashboard.home");
    }
	sincronizarService.sincronizar();
    var i = setInterval(function() { sincronizarService.sincronizar() }, 10000);
});
