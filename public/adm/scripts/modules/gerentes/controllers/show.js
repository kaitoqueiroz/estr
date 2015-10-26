'use strict';

app.controller('GerenteShowCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.gerente = null;
        $http.get("/admin/usuario/"+$stateParams.id).then(function(result) {
            $scope.gerente = result.data;
        });
    }    
    $scope.excluir = function(id){
        if(confirm('Tem certeza que deseja excluir?')) {
            $http.delete('/admin/usuario/'+id).then(function(result){
                Notification.success("Excluído com sucesso!");
                window.location = "#/gerentes"
            });
        }
    }
    $scope.initialize();
});