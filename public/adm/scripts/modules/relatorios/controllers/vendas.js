'use strict';
app.controller('VendasCtrl', function($scope,$state,$position,$http,$rootScope,Notification,$window,$filter) {
    $scope.initialize = function(){
        $http.get("/vendas").then(function(result) {
            $scope.totalItems = result.data.length;
            $scope.currentPage = 1;
            $scope.paginaAtual = 0;
            $scope.valor_total_periodo = 0;
            $scope.valor_total_pagina = 0;
            $scope.maxSize = 5;
            $scope.itemsPerPage = 10;
            $scope.de = moment(1,"DD").format("DD/MM/YYYY");
            $scope.ate = moment(1,"DD").add(1,'months').format("DD/MM/YYYY");
            $scope.toggleOrderType = "DESC";
            $scope.orderField = "id";
            $scope.paginate($scope.paginaAtual,$scope.itemsPerPage,$scope.toggleOrderType,$scope.orderField,$scope.de,$scope.ate);            
        });
    }
    $scope.paginate = function(pagina,itensPorPagina,orderBy,orderByField,de,ate){
        $http.get("/vendas",{
            params: {
                pagina: pagina,
                itensPorPagina: itensPorPagina,
                orderBy: orderBy,
                orderByField: orderByField,
                de: moment(de,'DD/MM/YYYY').format("YYYY-MM-DD 00:00:00"),
                ate: moment(ate,'DD/MM/YYYY').format("YYYY-MM-DD 23:59:59"),
            }
        }).
        success(function(result, status, headers, config) {
            $scope.vendas = result.list;
            $scope.valor_total_periodo = result.valor_total_periodo;
            $scope.valor_total_pagina = result.valor_total_pagina;
            $scope.numPages = Math.ceil($scope.vendas.length / $scope.itemsPerPage);

            $scope.pageCount = function () {
                return Math.ceil(vendas.length / $scope.itemsPerPage);
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