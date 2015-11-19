'use strict';
app.controller('RelatorioFiliaisAtendimentoCtrl', function($scope,$state,$position,$http,$rootScope,Notification,$window,$filter) {
    $scope.initialize = function(){
        $http.get("/atendimentos").then(function(result) {
            $scope.vendedor = {};
            $scope.totalItems = result.data.length;
            $scope.currentPage = 1;
            $scope.paginaAtual = 0;
            $scope.maxSize = 5;
            $scope.itemsPerPage = 10;
            $scope.de = moment(1,"DD").format("DD/MM/YYYY");
            $scope.ate = moment(1,"DD").add(1,'months').format("DD/MM/YYYY");
            $scope.toggleOrderType = "DESC";
            $scope.orderField = "atendimento.id";
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
        $http.get("/atendimentos",{
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
            $scope.atendimentos = result.dados;
            $scope.atendimentos_totais = result.total;
            $scope.numPages = Math.ceil($scope.atendimentos.length / $scope.itemsPerPage);

            $scope.pageCount = function () {
                return Math.ceil(atendimentos.length / $scope.itemsPerPage);
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
            $scope.vendedor.id
        );
    }
    $scope.initialize();
});