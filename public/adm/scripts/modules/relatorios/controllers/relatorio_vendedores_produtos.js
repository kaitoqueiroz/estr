'use strict';
app.controller('RelatorioVendedoresProdutosCtrl', function($scope,$state,$position,$http,$rootScope,Notification,$window,$filter) {
    $scope.initialize = function(){
        $http.get("/produtosVendidos").then(function(result) {
            $scope.produto_selecionado = {};    
            $scope.totalItems = result.data.dados.length;
            $scope.vendedor = {};
            $scope.currentPage = 1;
            $scope.paginaAtual = 0;
            $scope.maxSize = 5;
            $scope.itemsPerPage = 10;
            //$scope.de = moment(1,"DD").format("DD/MM/YYYY");
            $scope.de = moment(1,"DD").add(-1,'months').format("DD/MM/YYYY");
            $scope.ate = moment(1,"DD").format("DD/MM/YYYY");
            $scope.toggleOrderType = "DESC";
            $scope.orderField = "id";
            $scope.paginate(
                $scope.paginaAtual,
                $scope.itemsPerPage,
                $scope.toggleOrderType,
                $scope.orderField,
                $scope.de,
                $scope.ate
            );            
        });
        $http.get("/admin/vendedor",{
        }).then(function(result) {
            $scope.vendedores = result.data
        });
    }
    $scope.paginate = function(pagina,itensPorPagina,orderBy,orderByField,de,ate,vendedor_id){
        $http.get("/produtosVendidos",{
            params: {
                pagina: pagina,
                itensPorPagina: itensPorPagina,
                orderBy: orderBy,
                orderByField: orderByField,
                de: moment(de,'DD/MM/YYYY').format("YYYY-MM-DD 00:00:00"),
                ate: moment(ate,'DD/MM/YYYY').format("YYYY-MM-DD 23:59:59"),
                vendedor_id: vendedor_id,
            }
        }).
        success(function(result, status, headers, config) {
            $scope.produtos_vendidos = result.dados;
            $scope.dados_venda = result.dados_venda;
            $scope.numPages = Math.ceil($scope.produtos_vendidos.length / $scope.itemsPerPage);

            $scope.pageCount = function () {
                return Math.ceil(produtos_vendidos.length / $scope.itemsPerPage);
            };
            $scope.pageChanged = function() {
                $scope.paginate(
                    ($scope.currentPage-1),
                    $scope.itemsPerPage,
                    orderBy,
                    orderByField,
                    $scope.de,
                    $scope.ate
                );
            };
            //mostrar template após carregar
            $rootScope.$broadcast('show');
        });
    }    
    $scope.order = function(orderBy){
        $scope.toggleOrderType = ($scope.toggleOrderType=="DESC")?"ASC":"DESC";
        $scope.orderField = orderBy;
        $scope.paginate($scope.paginaAtual,$scope.itemsPerPage,$scope.toggleOrderType,$scope.orderField,$scope.de,$scope.ate);
    }
    $scope.changeItensPerPage = function(){
        $scope.paginate(
            $scope.paginaAtual,
            $scope.itemsPerPage,
            $scope.toggleOrderType,
            $scope.orderField,
            $scope.de,
            $scope.ate
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
    $scope.selecionarProduto = function(produto){
        $scope.produto_selecionado = produto;
    };
    $scope.initialize();
});