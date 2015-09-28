'use strict';

app.controller('HomeCtrl', function($scope,$position,$http,$rootScope,Notification,sincronizarService) {
    $scope.getClassBar = function(valor){
        if(valor < 30){
            return "danger";
        }else if(valor < 60){
            return "warning";
        }else if(valor < 100){
            return "success";
        }else{
            return "primary";
        }
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
                            if(el2.cod_venda == el.cod_venda){
                                el2.data = el.data;
                                meta.produtosVendidosData.push(el2);
                            }
                            return el2.cod_venda == el.cod_venda;
                        });                    
                    }
                    return el.dia == meta.dia;
                }else{
                    if(el.data.indexOf(meta.mes) > -1 ){
                        el.produtosvenda = $rootScope.produtosvenda.filter(function (el2) {
                            if(el2.cod_venda == el.cod_venda){
                                el2.mes = el.mes;
                                meta.produtosVendidosData.push(el2);
                            }
                            return el2.cod_venda == el.cod_venda;
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
                                venda.quantidade = parseInt(venda.quantidade);
                                vendido = (venda.quantidade + vendido);
                                valorVendido = parseInt(valorVendido);
                                valorVendido = (venda.quantidade)*($scope.getProdutoValor(venda.produto_id)) + valorVendido;
                            }
                            return venda.produto_id == produto_meta.produto_id;
                        });
                        produto_meta.vendido+=vendido;
                        produto_meta.valorVendido+=valorVendido;
                        totalMeta = parseInt(totalMeta);
                        produto_meta.quantidade = parseInt(produto_meta.quantidade);
                        totalMeta = produto_meta.quantidade*($scope.getProdutoValor(produto_meta.produto_id)) + totalMeta;
                    }
                    produto_meta.valorVendido = parseInt(produto_meta.valorVendido);
                    totalAtingido = (produto_meta.valorVendido + totalAtingido);

                    return produto_meta.meta_id == meta.id;
                });
            }
            
            meta.totalMeta = totalMeta;
            meta.totalAtingido = totalAtingido;



            console.log($rootScope.vendas);
            console.log($rootScope.produtosvenda);

            console.log(totalAtingido);


            meta.porcentagemMeta = Math.floor(totalAtingido*100/totalMeta);
            meta.classBar = $scope.getClassBar(meta.porcentagemMeta);
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
        sincronizarService.sincronizar();
        $scope.initialize();
    });
});