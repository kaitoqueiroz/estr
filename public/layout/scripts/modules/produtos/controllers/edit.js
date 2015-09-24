'use strict';

app.controller('ProdutoEditCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.produto = null;
        $http.get("/admin/produto/"+$stateParams.id).then(function(result) {
            $scope.produto = result.data;
        });
    }
    $scope.salvar = function(){

        $http.put("/admin/produto/"+$stateParams.id,$scope.produto).then(function(result) {
            Notification.success("Salvo com sucesso!");
        });
    }
    $scope.initialize();
});