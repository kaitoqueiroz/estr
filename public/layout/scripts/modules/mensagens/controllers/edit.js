'use strict';

app.controller('MensagemEditCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.mensagem = null;
        $http.get("/admin/mensagem/"+$stateParams.id).then(function(result) {
            $scope.mensagem = result.data;
        });
    }
    $scope.salvar = function(){

        $http.put("/admin/mensagem/"+$stateParams.id,$scope.mensagem).then(function(result) {
            Notification.success("Salvo com sucesso!");
        });
    }
    $scope.initialize();
});