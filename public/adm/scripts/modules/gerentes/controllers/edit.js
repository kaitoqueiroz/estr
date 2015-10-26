'use strict';

app.controller('GerenteEditCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.gerente = null;
        $http.get("/admin/usuario/"+$stateParams.id).then(function(result) {
            $scope.gerente = result.data;
        });
        $scope.filiais = null;
        $http.get("/admin/filial").then(function(result) {
            $scope.filiais = result.data;
        });
    }
    $scope.salvar = function(){

        $http.put("/admin/usuario/"+$stateParams.id,$scope.gerente).then(function(result) {
            Notification.success("Salvo com sucesso!");
            window.location = "#/gerentes";
        });
    }
    $scope.initialize();
});