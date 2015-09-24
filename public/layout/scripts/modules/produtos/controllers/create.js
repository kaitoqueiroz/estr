'use strict';

app.controller('ProdutoCreateCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.produto = null;
    }
    $scope.salvar = function(){
        $http.post("/admin/produto",$scope.produto).then(function(result) {
            Notification.success("Salvo com sucesso!");
        });
    }
    $scope.initialize();
});