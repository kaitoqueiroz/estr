'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp').controller('MainCtrl', function($scope,$state,$rootScope,$window,$http,$location,sincronizarService) {
    if($state.current.name == 'dashboard' || getCookie("usuario") == ""){
        $window.location.href = "#/login";
    }
	sincronizarService.sincronizar();
    var i = setInterval(function() { sincronizarService.sincronizar() }, 1000*60*5);


    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
        }
        return "";
    } 
});
