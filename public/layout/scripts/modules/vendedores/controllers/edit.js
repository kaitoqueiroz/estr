'use strict';

app.controller('VendedorEditCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.vendedor = null;
        $http.get("/admin/vendedor/"+$stateParams.id).then(function(result) {
            $scope.vendedor = result.data;
        });
        $scope.filiais = null;
        $http.get("/admin/filial").then(function(result) {
            $scope.filiais = result.data;
        });
    }
    $scope.salvar = function(){

        $http.put("/admin/vendedor/"+$stateParams.id,$scope.vendedor).then(function(result) {
            Notification.success("Salvo com sucesso!");
        });
    }
    $scope.initialize();
});