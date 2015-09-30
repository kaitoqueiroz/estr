'use strict';

app.controller('FilialShowCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.filial = null;
        $http.get("/admin/filial/"+$stateParams.id).then(function(result) {
            $scope.filial = result.data;
        });
    }    
    $scope.excluir = function(id){
        if(confirm('Tem certeza que deseja excluir?')) {
            $http.delete('/admin/filial/'+id).then(function(result){
                Notification.success("Excluído com sucesso!");
                window.location = "#/filiais"
            });
        }
    }
    $scope.initialize();
});