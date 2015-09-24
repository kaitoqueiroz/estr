'use strict';
app.controller('LoginCtrl', function($scope,$state,$position,$http,$rootScope,Notification,$window) {
    $scope.initialize = function(){
        $scope.login = '';
        $scope.senha = '';
    }
    $scope.entrar = function(){
        $http.post('/admin',{
            login: $scope.login,
            senha: $scope.senha
        }).success(function(result){
            console.log(result);
            $window.location.href = "#/home";
        }).error(function(){
            Notification.error("Usuário ou senha inválidos.");
        });
    }
    $scope.initialize();
});