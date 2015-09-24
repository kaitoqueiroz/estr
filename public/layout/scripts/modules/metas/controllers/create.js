'use strict';

app.controller('MetaCreateCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.meta = null;
        $scope.filial = null;
        $scope.filiais = [];
        $scope.vendedores = [];
        $scope.produtos = [];
        $scope.produto = null;
        $scope.produtos_meta = [];
        $scope.produtos_meta_total = 0;
        $http.get("/admin/produto").then(function(result) {
            $scope.produtos = result.data;
        });
        $http.get("/admin/filial").then(function(result) {
            $scope.filiais = result.data;
        });

        $scope.tipos = [
        	{id:"produto_diaria",descricao:"Meta diária de produtos"},
        	{id:"produto_mensal",descricao:"Meta mensal de produtos"},
        	{id:"valor_diaria",descricao:"Meta diária por valor"},
        	{id:"valor_mensal",descricao:"Meta mendal por valor"},
        ];
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
        $http.post("/admin/meta",$scope.meta).then(function(result) {
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
	            return true;
	        }
	    }

	    return false;
	}
    $scope.initialize();
});