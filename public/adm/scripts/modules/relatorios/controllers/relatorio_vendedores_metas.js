'use strict';
app.controller('RelatorioVendedoresMetasCtrl', function($scope,$state,$stateParams,$position,$http,$rootScope,Notification,$window,$filter) {
    $scope.initialize = function(){
        $http.get("/metas").then(function(result) {
            $scope.vendedor = {};
            $scope.meta_selecionada = {};
            $scope.totalItems = result.data.length;
            $scope.currentPage = 1;
            $scope.paginaAtual = 0;
            $scope.valor_total_meta = 0;
            $scope.valor_total_atingido = 0;
            $scope.maxSize = 5;
            $scope.itemsPerPage = 10;
            $scope.de = moment(1,"DD").format("DD/MM/YYYY");
            $scope.ate = moment(1,"DD").add(1,'months').format("DD/MM/YYYY");
            $scope.toggleOrderType = "DESC";
            $scope.orderField = "meta.id";
            $scope.paginate(
                $scope.paginaAtual,
                $scope.itemsPerPage,
                $scope.toggleOrderType,
                $scope.orderField,
                $scope.de,
                $scope.ate,
                $scope.vendedor.id
            );            
        });
        
        $http.get("/admin/vendedor",{
        }).then(function(result) {
            $scope.vendedores = result.data
        });
    }
    $scope.paginate = function(pagina,itensPorPagina,orderBy,orderByField,de,ate,vendedor_id){
        $http.get("/metas",{
            params: {
                pagina: pagina,
                tipo: $stateParams.tipo_meta,
                itensPorPagina: itensPorPagina,
                orderBy: orderBy,
                orderByField: orderByField,
                de: moment(de,'DD/MM/YYYY').format("YYYY-MM-DD 00:00:00"),
                ate: moment(ate,'DD/MM/YYYY').format("YYYY-MM-DD 23:59:59"),
                vendedor_id: vendedor_id,
            }
        }).
        success(function(result, status, headers, config) {
            $scope.metas = result.list;
            $scope.valor_total_meta = result.valor_total_meta;
            $scope.valor_total_atingido = result.valor_total_atingido;
            $scope.valor_total_atingido_meta = result.valor_total_atingido_meta;
            $scope.numPages = Math.ceil($scope.metas.length / $scope.itemsPerPage);

            $scope.pageCount = function () {
                return Math.ceil(metas.length / $scope.itemsPerPage);
            };
            $scope.pageChanged = function() {

                $scope.paginate(
                    ($scope.currentPage-1),
                    $scope.itemsPerPage,
                    orderBy,
                    orderByField,
                    $scope.de,
                    $scope.ate,
                    $scope.vendedor.id
                );
            };
            //mostrar template após carregar
            $rootScope.$broadcast('show');
        });
    }    
    $scope.order = function(orderBy){
        $scope.toggleOrderType = ($scope.toggleOrderType=="DESC")?"ASC":"DESC";
        $scope.orderField = orderBy;
        $scope.paginate(
            $scope.paginaAtual,
            $scope.itemsPerPage,
            $scope.toggleOrderType,
            $scope.orderField,
            $scope.de,
            $scope.ate,
            $scope.vendedor.id
        );
    }
    $scope.changeItensPerPage = function(){
        $scope.paginate(
            $scope.paginaAtual,
            $scope.itemsPerPage,
            $scope.toggleOrderType,
            $scope.orderField,
            $scope.de,
            $scope.ate,
            $scope.vendedor.id
        );
    }
    $scope.filtrar = function(){
        $scope.paginate(
            $scope.paginaAtual,
            $scope.itemsPerPage,
            $scope.toggleOrderType,
            $scope.orderField,
            $scope.de,
            $scope.ate,
            ($scope.vendedor)?$scope.vendedor.id:""
        );
    }
    $scope.selecionarMeta = function(meta){
        $scope.meta_selecionada = meta;
        $scope.meta_selecionada.produtos_vendidos = [];
        $scope.meta_selecionada.produtos_vendidos_meta = [];
        $scope.meta_selecionada.vendas.forEach(function(venda){
            venda.produtos.forEach(function(produto){

                var produto_meta = $scope.meta_selecionada.produtos.filter(function(obj){
                    return obj.produto_id == produto.produto_id;
                });
                if(produto_meta.length>0){
                    var produto_vendido_meta = $scope.meta_selecionada.produtos_vendidos_meta.filter(function(obj){
                        if(obj.produto_id == produto.produto_id){
                            obj.quantidade+=produto.quantidade;
                        }
                        return obj.produto_id == produto.produto_id;
                    });   

                    if(produto_vendido_meta.length==0){
                        $scope.meta_selecionada.produtos_vendidos_meta.push(produto);
                    }
                }

                var produto_vendido = $scope.meta_selecionada.produtos_vendidos.filter(function(obj){
                    if(obj.produto_id == produto.produto_id){
                        obj.quantidade+=produto.quantidade;
                    }
                    return obj.produto_id == produto.produto_id;
                });   

                if(produto_vendido.length==0){
                    $scope.meta_selecionada.produtos_vendidos.push(produto);
                }
            });
        });
        console.log($scope.meta_selecionada);
    }
    $scope.initialize();
});