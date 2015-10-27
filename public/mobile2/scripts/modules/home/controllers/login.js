'use strict';
app.controller('LoginCtrl', function($scope,$state,$position,$http,$rootScope,Notification,$window,sincronizarService) {
    $scope.initialize = function(){
        $scope.login = '';
        $scope.senha = '';
        $scope.erros = '';
    }
    $scope.entrar = function(){
        $http.get('/login',{
        // $http.get('http://104.131.24.32:81/login',{
            params:{
                login: $scope.login,
                senha: $scope.senha            }
        }).then(function(result){
            if(result.data.result == "OK"){
                try{
                    localStorage.usuario = result.data.usuario;

                    sincronizarService.sincronizar();

                    $window.location.href = "#/home";
                }catch(e){
                    $scope.erros = e;
                }

            }else{
                Notification.error("Usuário ou senha inválidos.");                
            }
        });
    }
    $scope.initialize();
});