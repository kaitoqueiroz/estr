'use strict';

app.controller('VendedorCreateCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.vendedor = null;
        $scope.filiais = null;
        $http.get("/admin/filial").then(function(result) {
        	$scope.filiais = result.data;
        });
    }
    $scope.salvar = function(){
        $http.post("/admin/vendedor",$scope.vendedor).then(function(result) {
            Notification.success("Salvo com sucesso!");
            window.location = "#/vendedores";
        });
    }
    $scope.initialize();
});