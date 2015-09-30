'use strict';

app.controller('ProdutoListCtrl', function($scope,$position,$http,$rootScope,Notification) {
    $scope.initialize = function(){
        $http.get("/admin/produto").then(function(result) {
            $scope.totalItems = result.data.length;
            $scope.currentPage = 1;
            $scope.paginaAtual = 0;
            $scope.maxSize = 5;
            $scope.itemsPerPage = 10;
            $scope.toggleOrderType = "DESC";
            $scope.orderField = "id";
            $scope.paginate($scope.paginaAtual,$scope.itemsPerPage,$scope.toggleOrderType,$scope.orderField);            
        });

    }
    $scope.paginate = function(pagina,itensPorPagina,orderBy,orderByField){
        $http.get("/admin/produto",{
            params: {
                pagina: pagina,
                itensPorPagina: itensPorPagina,
                orderBy: orderBy,
                orderByField: orderByField,
            }
        }).
        success(function(result, status, headers, config) {
            $scope.produtos = result;
            $scope.numPages = Math.ceil($scope.produtos.length / $scope.itemsPerPage);

            $scope.pageCount = function () {
                return Math.ceil(produtos.length / $scope.itemsPerPage);
            };
            $scope.pageChanged = function() {

                $scope.paginate(($scope.currentPage-1),$scope.itemsPerPage,orderBy,orderByField);
            };
            //mostrar template após carregar
            $rootScope.$broadcast('show');
        });
    }
    $scope.order = function(orderBy){
        $scope.toggleOrderType = ($scope.toggleOrderType=="DESC")?"ASC":"DESC";
        $scope.orderField = orderBy;
        $scope.paginate($scope.paginaAtual,$scope.itemsPerPage,$scope.toggleOrderType,$scope.orderField);
    }
    $scope.changeItensPerPage = function(){
        $scope.paginate($scope.paginaAtual,$scope.itemsPerPage,$scope.toggleOrderType,$scope.orderField);
    }
    $scope.excluir = function(id){
        if(confirm('Tem certeza que deseja excluir?')) {
            $http.delete('/admin/produto/'+id).then(function(result){
                $scope.paginate($scope.paginaAtual,$scope.itemsPerPage,$scope.toggleOrderType,$scope.orderField);
                Notification.success("Excluído com sucesso!");
            });
        }
    }
    $scope.initialize();
});