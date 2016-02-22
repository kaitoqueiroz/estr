'use strict';

app.controller('VendaShowCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.venda = null;
        $http.get("/admin/venda/"+$stateParams.id).then(function(result) {
            $scope.venda = result.data;
        });
    }    
    $scope.excluir = function(id){
        if(confirm('Tem certeza que deseja excluir?')) {
            $http.delete('/admin/venda/'+id).then(function(result){
                Notification.success("Excluído com sucesso!");
                window.location = "#/vendas"
            });
        }
    }
    $scope.initialize();
});