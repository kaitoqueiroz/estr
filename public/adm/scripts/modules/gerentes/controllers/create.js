'use strict';

app.controller('GerenteCreateCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.gerente = null;
        $scope.filiais = null;
        $http.get("/admin/filial").then(function(result) {
        	$scope.filiais = result.data;
        });
    }
    $scope.salvar = function(){
        $http.post("/admin/usuario",$scope.gerente).then(function(result) {
            Notification.success("Salvo com sucesso!");
            window.location = "#/gerentes";
        });
    }
    $scope.initialize();
});