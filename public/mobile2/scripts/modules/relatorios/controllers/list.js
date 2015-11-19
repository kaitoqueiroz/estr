'use strict';

app.controller('RelatorioListCtrl', function($scope,$stateParams,$position,$http,$rootScope,Notification) {
    $scope.initialize = function(){
        $scope.metas = [];
         $scope.metas = $rootScope.metas.filter(function (el) {
            el.deFormatado = moment(el.de,"YYYY-MM-DD").format("DD/MM/YYYY");
            el.ateFormatado = moment(el.ate,"YYYY-MM-DD").format("DD/MM/YYYY");
            
            return true;
        });
            console.log($scope.metas);
    }
    function when_external_loaded (callback) {
        if (typeof $rootScope.metas === 'undefined') {
            setTimeout (function () {
                when_external_loaded (callback);
            }, 100);
        } else {
            callback ();
        }
    }
    when_external_loaded (function () {
        $scope.initialize();
    });
});