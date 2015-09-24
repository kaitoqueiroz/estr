'use strict';

app.controller('FilialEditCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.filial = null;
        $http.get("/admin/filial/"+$stateParams.id).then(function(result) {
            $scope.filial = result.data;
        });
    }
    $scope.salvar = function(){

        $http.put("/admin/filial/"+$stateParams.id,$scope.filial).then(function(result) {
            Notification.success("Salvo com sucesso!");
        });
    }
    $scope.initialize();
});