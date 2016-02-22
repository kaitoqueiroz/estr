'use strict';

app.controller('VendaEditCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.produtos = [];
        $scope.filiais = [];
        $scope.produtos_venda_total = 0;
        $scope.vendedores = [];
        $http.get("/admin/venda/"+$stateParams.id).then(function(result) {
            $scope.venda = result.data;
            if($scope.venda.data != null){
                $scope.venda.data = moment($scope.venda.data).format("DDMMYYYY");
            }
            $scope.produtos_venda = $scope.venda.produtos_venda;
            $scope.selectFilial($scope.venda.filial);
            $scope.refreshTotal();
        });
        $http.get("/admin/produto").then(function(result) {
            $scope.produtos = result.data;
        });
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
        $scope.venda.produtos_venda = $scope.produtos_venda;
        $http.put("/admin/venda/"+$stateParams.id,$scope.venda).then(function(result) {
            Notification.success("Salvo com sucesso!");
            window.location = "#/vendas_list";
        });
    }
    $scope.adicionarProduto = function(){
        if(!$scope.containsObject($scope.produto, $scope.produtos_venda)){
            $scope.produtos_venda.push($scope.produto);
            $scope.refreshTotal();
        }else{
            Notification.error("O produto selecionado já foi adicionado.");
        }
    }
    $scope.removerProduto = function(id){
        $scope.produtos_venda = $scope.produtos_venda
           .filter(function (el) {
                return el.id !== id;
           });
        $scope.refreshTotal();
    }
    $scope.refreshTotal = function(){
        var total = 0;
        for(var i = 0; i < $scope.produtos_venda.length; i++){
            var produto = $scope.produtos_venda[i];
            total += (produto.valor * produto.quantidade);
        }
        $scope.produtos_venda_total = total;
        $scope.venda.valor = total;
    }
    $scope.containsObject = function(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].id === obj.id) {
                return list[i];
            }
        }

        return false;
    }
    $scope.initialize();
});