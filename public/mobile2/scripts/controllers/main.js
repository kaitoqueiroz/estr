'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp').controller('MainCtrl', function($scope,$state,$rootScope,$window,$http,$location,sincronizarService) {
    if($state.current.name == 'dashboard' || typeof localStorage.usuario == 'undefined'){
        $state.go("login");
    }else{
    	sincronizarService.sincronizar();
        var i = setInterval(function() { sincronizarService.sincronizar() }, 1000*60);
    }
});
