'use strict';
app.controller('RelatorioFiliaisMetasCtrl', function($scope,$state,$stateParams,$position,$http,$rootScope,Notification,$window,$filter) {
    $scope.initialize = function(){
        $http.get("/metas_filial").then(function(result) {
            $scope.filial = {};
            $scope.filial_selecionada = {};
            $scope.totalItems = result.data.length;
            $scope.currentPage = 1;
            $scope.paginaAtual = 0;
            $scope.valor_total_meta = 0;
            $scope.valor_total_atingido = 0;
            $scope.maxSize = 5;
            $scope.itemsPerPage = 10;
            $scope.mes = moment(1,"DD").format("MM/YYYY");
            $scope.toggleOrderType = "DESC";
            $scope.orderField = "meta.id";
            $scope.paginate(
                $scope.paginaAtual,
                $scope.itemsPerPage,
                $scope.toggleOrderType,
                $scope.orderField,
                $scope.mes,
                $scope.filial.id
            );            
        });
        
        $http.get("/admin/filial",{
        }).then(function(result) {
            $scope.filiais = result.data
        });
    }
    $scope.paginate = function(pagina,itensPorPagina,orderBy,orderByField,mes,filial_id){
        $http.get("/metas_filial",{
            params: {
                pagina: pagina,
                tipo: $stateParams.tipo_meta,
                itensPorPagina: itensPorPagina,
                orderBy: orderBy,
                orderByField: orderByField,
                mes: moment(mes,'MM/YYYY').format("YYYY-MM"),
                filial_id: filial_id,
            }
        }).
        success(function(result, status, headers, config) {
            $scope.metas = result.dados;
            $scope.numPages = Math.ceil($scope.metas.filiais.length / $scope.itemsPerPage);

            $scope.pageCount = function () {
                return Math.ceil(metas.length / $scope.itemsPerPage);
            };
            $scope.pageChanged = function() {

                $scope.paginate(
                    ($scope.currentPage-1),
                    $scope.itemsPerPage,
                    orderBy,
                    orderByField,
                    $scope.mes,
                    $scope.filial.id
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
            $scope.mes,
            $scope.filial.id
        );
    }
    $scope.changeItensPerPage = function(){
        $scope.paginate(
            $scope.paginaAtual,
            $scope.itemsPerPage,
            $scope.toggleOrderType,
            $scope.orderField,
            $scope.mes,
            $scope.filial.id
        );
    }
    $scope.filtrar = function(){
        $scope.paginate(
            $scope.paginaAtual,
            $scope.itemsPerPage,
            $scope.toggleOrderType,
            $scope.orderField,
            $scope.mes,
            ($scope.filial)?$scope.filial.id:""
        );
    }
    $scope.selecionarMeta = function(filial_id){
        console.log(filial_id);
        $http.get("/metas",{
            params: {
                filial_id: filial_id,
                de: moment($scope.mes,'MM/YYYY').format("YYYY-MM-DD 00:00:00"),
                ate: moment($scope.mes,'MM/YYYY').format("YYYY-MM-31 23:59:59"),
            }
        }).
        success(function(result) {
            $scope.filial_selecionada = result;
        });
    }
    $scope.initialize();
});