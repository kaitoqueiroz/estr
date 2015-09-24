'use strict';

app.controller('RelatorioViewCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.getClassBar = function(valor){
        return (valor < 30)?"danger":(valor < 60)?"warning":(valor < 100)?"success":"primary";
    }
    $scope.initialize = function(){
        var porcentagemMeta = 0;
        $scope.produtosVendidosData = [];
        $scope.produtosMeta = [];

        var totalMeta = 0;
        var totalAtingido = 0;

        $scope.meta = $scope.findById($stateParams.meta_id,$rootScope.metas);
        
        $scope.vendasRealizadas = $rootScope.vendas.filter(function (el) {
            if($scope.meta.tipo.indexOf("diaria") > -1){
                if(el.data == $scope.meta.data){
                    el.produtosvenda = $rootScope.produtosvenda.filter(function (el2) {
                        if(el2.venda_id == el.id){
                            el2.data = el.data;
                            $scope.produtosVendidosData.push(el2);
                        }
                        return el2.venda_id == el.id;
                    });                    
                }
                return el.dia == $scope.meta.dia;
            }else{
                if(el.data.indexOf($scope.meta.mes) > -1){
                    el.produtosvenda = $rootScope.produtosvenda.filter(function (el2) {
                        if(el2.venda_id == el.id){
                            el2.mes = el.mes;
                            $scope.produtosVendidosData.push(el2);
                        }
                        return el2.venda_id == el.id;
                    });                    
                }
                return el.data.indexOf($scope.meta.mes) > -1;
            }
        });
        
        if($scope.meta.tipo.indexOf("valor") > -1){
            var totalAtingido = 0;
            var totalMeta = $scope.meta.valor;
            $scope.produtosVendidosData.forEach(function (venda) {
                totalAtingido+=(venda.quantidade)*($scope.getProdutoValor(venda.produto_id));
            });
        }else{
            $scope.produtosMeta = $rootScope.produtosmeta.filter(function (produto_meta) {
                produto_meta.vendido = 0;
                produto_meta.valorVendido = 0;
                if(produto_meta.meta_id == $scope.meta.id){
                    var vendido = 0;
                    var valorVendido = 0;
                    var vendas = $scope.produtosVendidosData.filter(function (venda) {
                        if(venda.produto_id == produto_meta.produto_id){
                            vendido+=venda.quantidade;
                            valorVendido+=(venda.quantidade)*($scope.getProdutoValor(venda.produto_id));
                        }
                        return venda.produto_id == produto_meta.produto_id;
                    });
                    produto_meta.vendido+=vendido;
                    produto_meta.valorVendido+=valorVendido;
                    totalMeta+=produto_meta.quantidade*($scope.getProdutoValor(produto_meta.produto_id));
                }
                totalAtingido+=produto_meta.valorVendido;
                return produto_meta.meta_id == $scope.meta.id;
            });
        }
        
        $scope.totalMeta = totalMeta;
        $scope.totalAtingido = totalAtingido;

        $scope.porcentagemMeta = Math.floor(totalAtingido*100/totalMeta);
        $scope.classBar = $scope.getClassBar($scope.porcentagemMeta);
    }
    $scope.findById = function(id, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                return list[i];
            }
        }

        return false;
    }
    $scope.findByData = function(data, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].data === data) {
                return list[i];
            }
        }

        return false;
    }
    $scope.findMetaByMes = function(mes, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].mes === mes) {
                return list[i];
            }
        }

        return false;
    }
    $scope.findByMes = function(mes, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].data.indexOf(mes)>-1) {
                return list[i];
            }
        }

        return false;
    }
    $scope.findByProdutoId = function(produto_id, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].produto_id === produto_id) {
                return list[i];
            }
        }

        return false;
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

    function when_external_loaded (callback) {
        if (typeof $rootScope.metas === 'undefined' || 
            typeof $rootScope.produtosmeta === 'undefined' || 
            typeof $rootScope.vendas === 'undefined' || 
            typeof $rootScope.produtosvenda === 'undefined' || 
            typeof $rootScope.produtos === 'undefined') {
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