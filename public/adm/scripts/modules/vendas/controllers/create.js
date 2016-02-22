'use strict';

app.controller('VendaCreateCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.venda = null;
        $scope.filial = null;
        $scope.filiais = [];
        $scope.vendedores = [];
        $scope.produtos = [];
        $scope.produto = null;
        $scope.produtos_venda = [];
        $scope.produtos_venda_total = 0;
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
        $http.post("/admin/venda",$scope.venda).then(function(result) {
            Notification.success("Salvo com sucesso!");
            window.location = "#/vendas";
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
                return true;
            }
        }

        return false;
    }
	$scope.verificarDatas = function() {
        if($scope.venda.de && $scope.venda.ate){

            if($scope.venda.de.substring(3, 5) != $scope.venda.ate.substring(3, 5)){
                alert("O período selecionado não deve estar em meses diferentes.");
                return;
            }
            if(moment($scope.venda.de, "DD-MM-YYYY") > moment($scope.venda.ate, "DD-MM-YYYY")){
                alert("A data inicial deve ser maior que a data final.");
                return;
            }
        }
    }

    $scope.initialize();
});