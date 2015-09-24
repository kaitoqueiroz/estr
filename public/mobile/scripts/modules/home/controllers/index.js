'use strict';

app.controller('HomeCtrl', function($scope,$position,$http,$rootScope,Notification) {
    $scope.getClassBar = function(valor){
        return (valor < 30)?"danger":(valor < 60)?"warning":(valor < 100)?"success":"primary";
    }
    $scope.initialize = function(){
        var porcentagemMeta = 0;


        var darias = $rootScope.metas.filter(function (meta) {
            return meta.data == moment().format("YYYY-MM-DD");
        });
        var mensais = $rootScope.metas.filter(function (meta) {
            return meta.mes == moment().format("YYYY-MM");
        });        

        $scope.metasDiarias = [];
        $scope.metasMensais = [];
        $scope.metasDiarias = $scope.getMetas(darias);
        $scope.metasMensais = $scope.getMetas(mensais);

        console.log($scope.metasDiarias);
        console.log($scope.metasMensais);

    }
    $scope.getMetas = function(metas){
        var returnMetas = [];
        metas.forEach(function(meta){
            meta.produtosVendidosData = [];
            meta.produtosMeta = [];
            var totalMeta = 0;
            var totalAtingido = 0;
            meta.vendasRealizadas = $rootScope.vendas.filter(function (el) {
                if(meta.tipo.indexOf("diaria") > -1){
                    if(el.data == meta.data){
                        el.produtosvenda = $rootScope.produtosvenda.filter(function (el2) {
                            if(el2.venda_id == el.id){
                                el2.data = el.data;
                                meta.produtosVendidosData.push(el2);
                            }
                            return el2.venda_id == el.id;
                        });                    
                    }
                    return el.dia == meta.dia;
                }else{
                    if(el.data.indexOf(meta.mes) > -1 ){
                        el.produtosvenda = $rootScope.produtosvenda.filter(function (el2) {
                            if(el2.venda_id == el.id){
                                el2.mes = el.mes;
                                meta.produtosVendidosData.push(el2);
                            }
                            return el2.venda_id == el.id;
                        });                    
                    }
                    return el.data.indexOf(meta.mes) > -1;
                }
            });
            
            if(meta.tipo.indexOf("valor") > -1){
                var totalAtingido = 0;
                var totalMeta = meta.valor;
                meta.produtosVendidosData.forEach(function (venda) {
                    totalAtingido+=(venda.quantidade)*($scope.getProdutoValor(venda.produto_id));
                });
            }else{
                meta.produtosMeta = $rootScope.produtosmeta.filter(function (produto_meta) {
                    produto_meta.vendido = 0;
                    produto_meta.valorVendido = 0;
                    if(produto_meta.meta_id == meta.id){
                        var vendido = 0;
                        var valorVendido = 0;
                        var vendas = meta.produtosVendidosData.filter(function (venda) {
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
                    return produto_meta.meta_id == meta.id;
                });
            }
            
            meta.totalMeta = totalMeta;
            meta.totalAtingido = totalAtingido;

            meta.porcentagemMeta = Math.floor(totalAtingido*100/totalMeta);
            meta.classBar = $scope.getClassBar($scope.porcentagemMeta);
            meta.tipoRelatorio = (meta.tipo == "produto_diaria" || meta.tipo == "produto_mensal")?"produto":"valor";
            meta.dataMeta = moment(meta.data).format('DD/MM/YYYY');
            meta.mesMeta = moment(meta.mes+"-01").format('MM/YYYY');

            returnMetas.push(meta);
        });
        return returnMetas;
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