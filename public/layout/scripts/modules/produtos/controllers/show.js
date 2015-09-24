'use strict';

app.controller('ProdutoShowCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.produto = null;
        $http.get("/admin/produto/"+$stateParams.id).then(function(result) {
            $scope.produto = result.data;
        });
    }    
    $scope.excluir = function(id){
        if(confirm('Tem certeza que deseja excluir?')) {
            $http.delete('/admin/produto/'+id).then(function(result){
                Notification.success("Excluído com sucesso!");
                window.location = "#/produtos"
            });
        }
    }
    $scope.initialize();
});