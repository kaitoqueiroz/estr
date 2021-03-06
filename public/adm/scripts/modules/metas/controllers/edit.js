'use strict';

app.controller('MetaEditCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.produtos = [];
        $scope.filiais = [];
        $scope.produtos_meta_total = 0;
        $scope.vendedores = [];
        $http.get("/admin/meta/"+$stateParams.id).then(function(result) {
            $scope.meta = result.data;
            if($scope.meta.de != null){
                $scope.meta.de = moment($scope.meta.de).format("DDMMYYYY");
            }
            if($scope.meta.ate != null){
                $scope.meta.ate = moment($scope.meta.ate).format("DDMMYYYY");
            }
            $scope.produtos_meta = $scope.meta.produtos_meta;
            $scope.selectFilial($scope.meta.filial);
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
        $scope.meta.produtos_meta = $scope.produtos_meta;
        $http.put("/admin/meta/"+$stateParams.id,$scope.meta).then(function(result) {
            Notification.success("Salvo com sucesso!");
            window.location = "#/metas";
        });
    }
    $scope.adicionarProduto = function(){
        if(!$scope.containsObject($scope.produto, $scope.produtos_meta)){
            $scope.produtos_meta.push($scope.produto);
            $scope.refreshTotal();
        }else{
            Notification.error("O produto selecionado já foi adicionado.");
        }
    }
    $scope.removerProduto = function(id){
        $scope.produtos_meta = $scope.produtos_meta
           .filter(function (el) {
                return el.id !== id;
           });
        $scope.refreshTotal();
    }
    $scope.refreshTotal = function(){
        var total = 0;
        for(var i = 0; i < $scope.produtos_meta.length; i++){
            var produto = $scope.produtos_meta[i];
            total += (produto.valor * produto.quantidade);
        }
        $scope.produtos_meta_total = total;
        $scope.meta.valor = total;
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