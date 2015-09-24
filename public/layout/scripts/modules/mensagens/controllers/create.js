'use strict';

app.controller('MensagemCreateCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.mensagem = null;
    }
    $scope.salvar = function(){
        $http.post("/admin/mensagem",$scope.mensagem).then(function(result) {
            Notification.success("Salvo com sucesso!");
        });
    }
    $scope.initialize();
});