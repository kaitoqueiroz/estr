'use strict';

app.controller('MensagemEditCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.mensagem = {};
        $scope.mensagem.vendedor_id = {};
        $scope.filiais = [];
        $scope.vendedores = [];

        $http.get("/admin/filial").then(function(result) {
            $scope.filiais = result.data;
        });
        $http.get("/admin/mensagem/"+$stateParams.id).then(function(result) {
            $scope.mensagem = result.data;

            $http.get("/admin/vendedor/"+$scope.mensagem.vendedor_id).then(function(result2) {
                $scope.vendedor = result2.data;

                $http.get("/admin/filial/"+$scope.vendedor.filial_id).then(function(result3) {
                    $scope.filial = result3.data;

                    $http.get("/admin/vendedor",{
                        params : {
                            vendedores_by_filial : $scope.filial.id
                        }
                    }).then(function(result4) {
                        $scope.vendedores = result4.data;
                        $scope.mensagem.vendedor_id = result2.data;
                        console.log($scope.vendedor_id);
                    });

                });
            });
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

        $http.put("/admin/mensagem/"+$stateParams.id,$scope.mensagem).then(function(result) {
            Notification.success("Salvo com sucesso!");
            window.location = "#/mensagens";
        });
    }
    $scope.initialize();
});