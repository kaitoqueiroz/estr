'use strict';

app.controller('MensagemCtrl', function($scope,$position,$http,$rootScope,Notification,sincronizarService) {
    $scope.initialize = function(){

        $scope.inserir_mensagem = '';
        var mensagens = $rootScope.mensagens;
        $rootScope.mensagens.forEach(function(mensagem){
            $rootScope.lib.insert("mensagensvendedor", {mensagem_id: mensagem.id, vendedor_id: mensagem.vendedor_id});            
        });
        sincronizarService.sincronizar();
    }
    $scope.enviarMensagem = function () {
        var mensagem = {
            cod_mensagem: moment().format("YYYYMMDDHHmmSSSS")+$rootScope.vendedor.id,
            mensagem: $scope.inserir_mensagem,
            sender: 'vendedor',
            vendedor_id: $rootScope.vendedor.id,
            created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        $rootScope.mensagens.push(mensagem);
        $rootScope.lib.insert("mensagens", mensagem);
        $rootScope.lib.insert("mensagensvendedor", {mensagem_id: '', vendedor_id: $rootScope.vendedor.id});

        $scope.inserir_mensagem = '';
    }

    function when_external_loaded (callback) {
      if (typeof $rootScope.mensagens === 'undefined') {
        setTimeout (function () {
           when_external_loaded (callback);
        }, 100); // wait 100 ms
      } else { callback (); }
    }
    when_external_loaded (function () {
        $scope.initialize();
    });
    
});