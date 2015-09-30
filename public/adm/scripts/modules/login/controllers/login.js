'use strict';
app.controller('LoginCtrl', function($scope,$state,$position,$http,$rootScope,Notification,$window) {
    $scope.initialize = function(){
        $scope.login = '';
        $scope.senha = '';
        $scope.erros = '';
    }
    $scope.entrar = function(){
        $http.get('/loginAdmin',{
            params:{
                login: $scope.login,
                senha: $scope.senha            }
        }).then(function(result){
            if(result.data.result == "OK"){
                $state.go("dashboard.dashboard");
            }else{
                Notification.error("Usuário ou senha inválidos.");                
            }
        });
    }
    $scope.initialize();
});