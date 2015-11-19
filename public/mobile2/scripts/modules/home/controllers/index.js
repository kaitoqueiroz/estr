'use strict';

app.controller('HomeCtrl', function($scope,$stateParams,$position,$http,$rootScope,Notification) {
    $scope.initialize = function(){
        $scope.metasVigentes = $rootScope.metas.filter(function(meta){
            return moment().format('YYYY-10-DD') >= meta.de && moment().format('YYYY-10-DD') <= meta.ate;
        });

        $scope.metasVigentes.forEach(function(meta){
            meta.produtosVenda = [];
            meta.totalMeta = 0;
            meta.totalAtingido = 0;
            meta.totalVendas = 0;
            meta.produtosMeta = $rootScope.produtosmeta.filter(function(obj){
                obj.vendido = 0;
                if(obj.meta_id == meta.id){
                    meta.totalMeta+=$scope.getProdutoValor(obj.produto_id)*obj.quantidade;
                }
                return obj.meta_id == meta.id;
            });

            meta.meta = $scope.getMeta(meta.id);

            meta.vendasMeta = $rootScope.vendas.filter(function(obj){
                obj.vendido = 0;
                obj.produtos = $scope.getProdutosVenda(obj.id);
                return obj.data >= meta.meta.de && obj.data <= meta.meta.ate;
            });

            meta.vendasMeta.forEach(function(venda){
                venda.produtos.forEach(function(produto_venda){
                    produto_venda.vendido+=produto_venda.quantidade;
                    meta.totalVendas+=$scope.getProdutoValor(produto_venda.produto_id)*produto_venda.quantidade;
                    meta.produtosMeta = meta.produtosMeta.filter(function(obj){
                        if(produto_venda.produto_id == obj.produto_id){
                            obj.vendido+=produto_venda.quantidade;
                            meta.totalAtingido+=$scope.getProdutoValor(produto_venda.produto_id)*produto_venda.quantidade;
                        }
                        return true;
                    });
                    meta.produtosVenda.push(produto_venda);
                });
            });
            meta.porcentagemMetaProdutos = Math.floor(meta.totalAtingido*100/meta.totalMeta);
            meta.porcentagemMetaFinanceira = Math.floor(meta.totalVendas*100/meta.totalMeta);
            meta.classBarProduto = $scope.getClassBar(meta.porcentagemMetaProdutos);
            meta.classBarFinanceira = $scope.getClassBar(meta.porcentagemMetaFinanceira);
        });
    }
    $scope.formatarData = function(data){
        return moment(data, 'YYYY-MM-DD').format('DD/MM/YYYY');
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