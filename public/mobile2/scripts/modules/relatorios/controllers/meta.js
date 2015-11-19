'use strict';

app.controller('RelatorioMetaCtrl', function($scope,$stateParams,$position,$http,$rootScope,Notification) {
    $scope.initialize = function(){
        $scope.produtosVenda = [];
        $scope.totalMeta = 0;
        $scope.totalAtingido = 0;
        $scope.totalVendas = 0;
        $scope.produtosMeta = $rootScope.produtosmeta.filter(function(obj){
            obj.vendido = 0;
            if(obj.meta_id == $stateParams.meta_id){
                $scope.totalMeta+=$scope.getProdutoValor(obj.produto_id)*obj.quantidade;
            }
            return obj.meta_id == $stateParams.meta_id;
        });

        $scope.meta = $scope.getMeta($stateParams.meta_id);

        $scope.vendasMeta = $rootScope.vendas.filter(function(obj){
            obj.vendido = 0;
            obj.produtos = $scope.getProdutosVenda(obj.id);
            return obj.data >= $scope.meta.de && obj.data <= $scope.meta.ate;
        });

        $scope.vendasMeta.forEach(function(venda){
            venda.produtos.forEach(function(produto_venda){
                produto_venda.vendido+=produto_venda.quantidade;
                $scope.totalVendas+=$scope.getProdutoValor(produto_venda.produto_id)*produto_venda.quantidade;
                $scope.produtosMeta = $scope.produtosMeta.filter(function(obj){
                    if(produto_venda.produto_id == obj.produto_id){
                        obj.vendido+=produto_venda.quantidade;
                        $scope.totalAtingido+=$scope.getProdutoValor(produto_venda.produto_id)*produto_venda.quantidade;
                    }
                    return true;
                });
                $scope.produtosVenda.push(produto_venda);
            });
        });
        $scope.porcentagemMetaProdutos = Math.floor($scope.totalAtingido*100/$scope.totalMeta);
        $scope.porcentagemMetaFinanceira = Math.floor($scope.totalVendas*100/$scope.totalMeta);
        $scope.classBarProduto = $scope.getClassBar($scope.porcentagemMetaProdutos);
        $scope.classBarFinanceira = $scope.getClassBar($scope.porcentagemMetaFinanceira);
    }
    $scope.getClassBar = function(valor){
        if(valor < 30){
            return "danger";
        }
        if(valor < 60){
            return "warning";
        }
        if(valor <= 100){
            return "success";
        }
        if(valor>100){
            return "primary";
        }
    }

    $scope.getProdutoDescricao = function(id){
        var produto = $rootScope.produtos.filter(function (el) {
            return el.id == id;
        });
        return produto[0].descricao;
    }
    $scope.getProdutoValor = function(id){
        var produto = $rootScope.produtos.filter(function (el) {
            return el.id == id;
        });
        return produto[0].valor;
    }
    $scope.getMeta = function(id){
        var meta = $rootScope.metas.filter(function (el) {
            return el.id == id;
        });
        return meta[0];
    }
    $scope.getProdutosVenda = function(venda_id){
        var produtosVenda = $rootScope.produtosvenda.filter(function (el) {
            return el.venda_id == venda_id;
        });
        return produtosVenda;
    }

    function when_external_loaded (callback) {
        if (typeof $rootScope.produtosmeta === 'undefined' || 
            typeof $rootScope.produtos === 'undefined' || 
            typeof $rootScope.vendas === 'undefined' || 
            typeof $rootScope.produtosvenda === 'undefined'
            ) {
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