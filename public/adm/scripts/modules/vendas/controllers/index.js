'use strict';

app.filter('moment', function () {
  return function (input, momentFn /*, param1, param2, ...param n */) {
    var args = Array.prototype.slice.call(arguments, 2),
        momentObj = moment(input);
    return momentObj[momentFn].apply(momentObj, args);
  };
}).controller('VendaListCtrl', function($scope,$position,$http,$rootScope,Notification) {
    $scope.initialize = function(){
        $http.get("/vendas").then(function(result) {
            $scope.totalItems = result.data.list.length;
            $scope.currentPage = 1;
            $scope.paginaAtual = 0;
            $scope.maxSize = 5;
            $scope.itemsPerPage = 10;
            $scope.toggleOrderType = "DESC";
            $scope.orderField = "id";
            $scope.paginate($scope.paginaAtual,$scope.itemsPerPage,$scope.toggleOrderType,$scope.orderField);            
        });
        $scope.tipos = {
            produto_diaria : "Venda diária de produtos",
            produto_mensal: "Venda mensal de produtos",
            valor_diaria : "Venda diária por valor",
            valor_mensal :"Venda mendal por valor",
        };
        console.log($scope.tipos);
    }
    $scope.paginate = function(pagina,itensPorPagina,orderBy,orderByField){
        $http.get("/vendas",{
            params: {
                pagina: pagina,
                itensPorPagina: itensPorPagina,
                orderBy: orderBy,
                orderByField: orderByField,
            }
        }).
        success(function(result, status, headers, config) {
            $scope.vendas = result;
            $scope.numPages = Math.ceil($scope.vendas.length / $scope.itemsPerPage);

            $scope.pageCount = function () {
                return Math.ceil(vendas.length / $scope.itemsPerPage);
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
            $http.delete('/admin/venda/'+id).then(function(result){
                $scope.paginate($scope.paginaAtual,$scope.itemsPerPage,$scope.toggleOrderType,$scope.orderField);
                Notification.success("Excluído com sucesso!");
            });
        }
    }
    $scope.initialize();
});