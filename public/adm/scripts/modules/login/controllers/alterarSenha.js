'use strict';
app.controller('AlterarSenhaCtrl', function($scope,$state,$position,$http,$rootScope,Notification,$window) {
    $scope.initialize = function(){
        $scope.senha_antiga = '';
        $scope.nova_senha = '';
        $scope.confirmar_nova_senha = '';
    }
    $scope.salvar = function(){
        $http.put('/updateSenha/'+getCookie('admin'),{
            senha: $scope.senha_antiga,          
            nova_senha: $scope.nova_senha
        }).then(function(result){
            if(result.data.result == "OK"){
                Notification.success("Senha alterada com sucesso.");
                $state.go('dashboard.dashboard');
            }else{
                Notification.error("Senha antiga não confere.");                
            }
        });
    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }
    $scope.initialize();
});