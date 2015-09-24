'use strict';

app.controller('RelatorioCtrl', function($scope,$position,$http,$rootScope,Notification) {
    $scope.initialize = function(){
        $scope.produto = null;
        $scope.produtos_meta = [];
        $scope.produtos = [
            {id:1,descricao:"Produto 1"},
            {id:2,descricao:"Produto 2"},
            {id:3,descricao:"Produto 3"},
        ];
    }

    $scope.adicionarProduto = function(){
        if(!$scope.containsObject($scope.produto, $scope.produtos_meta)){
            $scope.produtos_meta.push($scope.produto);
        }else{
            Notification.error("O produto selecionado já foi adicionado.");
        }
    }
    $scope.containsObject = function(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].id === obj.id) {
                return true;
            }
        }

        return false;
    }
    $scope.initialize();
});