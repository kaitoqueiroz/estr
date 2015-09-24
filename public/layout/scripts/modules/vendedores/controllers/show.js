'use strict';

app.controller('VendedorShowCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.vendedor = null;
        $http.get("/admin/vendedor/"+$stateParams.id).then(function(result) {
            $scope.vendedor = result.data;
        });
    }    
    $scope.excluir = function(id){
        if(confirm('Tem certeza que deseja excluir?')) {
            $http.delete('/admin/vendedor/'+id).then(function(result){
                Notification.success("Excluído com sucesso!");
                window.location = "#/vendedores"
            });
        }
    }
    $scope.initialize();
});