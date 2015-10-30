'use strict';
app.controller('RelatorioVendedoresMetasCtrl', function($scope,$state,$stateParams,$position,$http,$rootScope,Notification,$window,$filter) {
            console.log($stateParams);
    $scope.initialize = function(){
        $http.get("/metas").then(function(result) {
            $scope.vendedor = {};
            $scope.totalItems = result.data.length;
            $scope.currentPage = 1;
            $scope.paginaAtual = 0;
            $scope.valor_total_meta = 0;
            $scope.valor_total_atingido = 0;
            $scope.maxSize = 5;
            $scope.itemsPerPage = 10;
            $scope.de = moment(1,"DD").add(-1,'months').format("DD/MM/YYYY");
            $scope.ate = moment(1,"DD").format("DD/MM/YYYY");
            $scope.toggleOrderType = "DESC";
            $scope.orderField = "id";
            $scope.paginate($scope.paginaAtual,$scope.itemsPerPage,$scope.toggleOrderType,$scope.orderField,$scope.de,$scope.ate);            
        });
        
        $http.get("/admin/vendedor",{
        }).then(function(result) {
            $scope.vendedores = result.data
        });
    }
    $scope.paginate = function(pagina,itensPorPagina,orderBy,orderByField,de,ate){
        $http.get("/metas",{
            params: {
                pagina: pagina,
                tipo: $stateParams.tipo_meta,
                itensPorPagina: itensPorPagina,
                orderBy: orderBy,
                orderByField: orderByField,
                de: moment(de,'DD/MM/YYYY').format("YYYY-MM-DD 00:00:00"),
                ate: moment(ate,'DD/MM/YYYY').format("YYYY-MM-DD 23:59:59"),
            }
        }).
        success(function(result, status, headers, config) {
            $scope.metas = result.list;
            $scope.valor_total_meta = result.valor_total_meta;
            $scope.valor_total_atingido = result.valor_total_atingido;
            $scope.numPages = Math.ceil($scope.metas.length / $scope.itemsPerPage);

            $scope.pageCount = function () {
                return Math.ceil(metas.length / $scope.itemsPerPage);
            };
            $scope.pageChanged = function() {

                $scope.paginate(($scope.currentPage-1),$scope.itemsPerPage,orderBy,orderByField,$scope.de,$scope.ate);
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
        $scope.paginate($scope.paginaAtual,$scope.itemsPerPage,$scope.toggleOrderType,$scope.orderField,$scope.de,$scope.ate);
    }
    $scope.filtrar = function(){
        $scope.paginate($scope.paginaAtual,$scope.itemsPerPage,$scope.toggleOrderType,$scope.orderField,$scope.de,$scope.ate);
    }
    $scope.initialize();
});