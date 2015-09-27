'use strict';

app.controller('RelatorioListCtrl', function($scope,$stateParams,$position,$http,$rootScope,Notification) {
    $scope.initialize = function(){
    	$scope.tipo = ($stateParams.tipo == "produto_diaria" || $stateParams.tipo == "produto_mensal")?"produto":"valor";
        $scope.metas = $rootScope.metas.filter(function (el) {
            if(el.data != null)
                el.data = moment(el.data).format("DD/MM/YYYY");
            
            if(el.mes != null)
                el.mes = moment(el.mes).format("MM/YYYY");
            
            return el.tipo == $stateParams.tipo;
        });
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