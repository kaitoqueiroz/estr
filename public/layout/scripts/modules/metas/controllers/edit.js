'use strict';

app.controller('MetaEditCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.produtos = [];
        $scope.filiais = [];
        $scope.produtos_meta_total = 0;
        $scope.vendedores = [];
        $scope.tipos = [
            {id:"produto_diaria",descricao:"Meta diária de produtos"},
            {id:"produto_mensal",descricao:"Meta mensal de produtos"},
            {id:"valor_diaria",descricao:"Meta diária por valor"},
            {id:"valor_mensal",descricao:"Meta mensal por valor"},
        ];
        $http.get("/admin/meta/"+$stateParams.id).then(function(result) {
            $scope.meta = result.data;
            if($scope.meta.data != null){
                $scope.meta.data = moment($scope.meta.data).format("DD/MM/YYYY");
            }
            if($scope.meta.mes != null){
                $scope.meta.mes = moment($scope.meta.mes).format("MM/YYYY");
            }
            $scope.produtos_meta = $scope.meta.produtos_meta;
            $scope.selectFilial($scope.filial);
            $scope.meta.tipo = $scope.containsObject({id:$scope.meta.tipo},$scope.tipos);
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
    }
    $scope.refreshTotal = function(){
        var total = 0;
        for(var i = 0; i < $scope.produtos_meta.length; i++){
            var produto = $scope.produtos_meta[i];
            total += (produto.valor * produto.quantidade);
        }
        $scope.produtos_meta_total = total;
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