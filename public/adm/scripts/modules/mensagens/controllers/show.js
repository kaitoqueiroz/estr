'use strict';

app.controller('MensagemShowCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.inserir_mensagem = '';
        $scope.mensagens = null;
        $http.get("/admin/mensagem/"+$stateParams.id).then(function(result) {
            $scope.mensagens = result.data;
        });
    }

    $scope.enviarMensagem = function(){
        var mensagem = {
            mensagem : $scope.inserir_mensagem,
            vendedor_id : $stateParams.id,
        };
        $http.post("/admin/mensagem",mensagem).then(function(result) {
            $scope.initialize();
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