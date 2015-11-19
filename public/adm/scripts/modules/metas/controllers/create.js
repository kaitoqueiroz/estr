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
                return true;
            }
        }

        return false;
    }
	$scope.verificarDatas = function() {
        if($scope.meta.de && $scope.meta.ate){

            if($scope.meta.de.substring(3, 5) != $scope.meta.ate.substring(3, 5)){
                alert("O período selecionado não deve estar em meses diferentes.");
                return;
            }
            if(moment($scope.meta.de, "DD-MM-YYYY") > moment($scope.meta.ate, "DD-MM-YYYY")){
                alert("A data inicial deve ser maior que a data final.");
                return;
            }
        }
    }

    $scope.initialize();
});