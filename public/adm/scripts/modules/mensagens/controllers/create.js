'use strict';

app.controller('MensagemCreateCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.mensagem = null;
        $scope.vendedor_id = null;
        $scope.filiais = [];
        $scope.vendedores = [];

        $http.get("/admin/filial").then(function(result) {
            $scope.filiais = result.data;
        });
    }
    $scope.selectFilial = function(filial){
        $http.get("/admin/vendedor",{
            params : {
                vendedores_by_filial : filial.id
            }
        }).then(function(result) {
            $scope.vendedores = result.data
        });
    }
    $scope.salvar = function(){
        $http.post("/admin/mensagem",$scope.mensagem).then(function(result) {
            Notification.success("Salvo com sucesso!");
            window.location = "#/mensagens";
        });
    }
    $scope.initialize();
});