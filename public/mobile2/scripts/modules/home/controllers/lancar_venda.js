'use strict';

app.controller('LancarVendaCtrl', function($scope,$state,$position,$http,$rootScope,Notification) {
    $scope.initialize = function(){
        $scope.produto = null;
        $scope.produtos_venda = [];
        $scope.valor_total = 0;
        $scope.produtos = $rootScope.produtos;
    }

    $scope.adicionarProduto = function(){
        if(!$scope.containsObject($scope.produto, $scope.produtos_venda)){
            $scope.produtos_venda.push($scope.produto);
            $scope.refreshTotal();
        }else{
            Notification.error("O produto selecionado já foi adicionado.");
        }
    }
    $scope.finalizar = function(){
        var d = new Date();
        var data_venda = d.getTime();

        var venda_id = $rootScope.lib.insert("vendas", {cod_venda: $rootScope.vendedor.id+"_"+data_venda, vendedor_id: $rootScope.vendedor.id, data: moment().format("YYYY-MM-DD")});

        $scope.produtos_venda.forEach(function(obj2){
            $rootScope.lib.insert("produtosvenda", {id: obj2.id, quantidade: obj2.quantidade, cod_venda: $rootScope.vendedor.id+"_"+data_venda, venda_id: venda_id, produto_id: obj2.id});
        });
        $rootScope.vendas = $rootScope.lib.queryAll("vendas");
        $rootScope.produtosvenda = $rootScope.lib.queryAll("produtosvenda");


        Notification.success("Lançamento da venda realizada com sucesso.");

        window.location = "#/home";
    }
    $scope.refreshTotal = function(){
        var total = 0;
        for(var i = 0; i < $scope.produtos_venda.length; i++){
            var produto = $scope.produtos_venda[i];
            total += (produto.valor * produto.quantidade);
        }
        $scope.valor_total = total;
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
    function when_external_loaded (callback) {
        if (typeof $rootScope.produtos === 'undefined' || typeof $rootScope.vendedor === 'undefined') {
            setTimeout (function () {
                when_external_loaded (callback);
            }, 100);
        } else {
            callback ();
        }
    }
    when_external_loaded (function () {
        $scope.initialize();
    });
});