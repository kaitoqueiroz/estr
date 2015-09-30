'use strict';

app.controller('FilialCreateCtrl', function($scope,$position,$http,$rootScope,Notification,$stateParams) {
    $scope.initialize = function(){
        $scope.filial = null;
    }
    $scope.salvar = function(){
        $http.post("/admin/filial",$scope.filial).then(function(result) {
            Notification.success("Salvo com sucesso!");
            window.location = "#/filiais";
        });
    }
    $scope.initialize();
});