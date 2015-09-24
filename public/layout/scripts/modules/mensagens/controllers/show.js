'use strict';

app.controller('MensagemShowCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.mensagem = null;
        $http.get("/admin/mensagem/"+$stateParams.id).then(function(result) {
            $scope.mensagem = result.data;
        });
    }    
    $scope.excluir = function(id){
        if(confirm('Tem certeza que deseja excluir?')) {
            $http.delete('/admin/mensagem/'+id).then(function(result){
                Notification.success("Excluído com sucesso!");
                window.location = "#/mensagens"
            });
        }
    }
    $scope.initialize();
});