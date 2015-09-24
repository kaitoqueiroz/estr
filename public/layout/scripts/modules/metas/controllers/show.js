'use strict';

app.controller('MetaShowCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.meta = null;
        $http.get("/admin/meta/"+$stateParams.id).then(function(result) {
            $scope.meta = result.data;
        });
    }    
    $scope.excluir = function(id){
        if(confirm('Tem certeza que deseja excluir?')) {
            $http.delete('/admin/meta/'+id).then(function(result){
                Notification.success("Excluído com sucesso!");
                window.location = "#/metas"
            });
        }
    }
    $scope.initialize();
});