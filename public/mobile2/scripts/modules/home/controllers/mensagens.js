'use strict';

app.controller('MensagemCtrl', function($scope,$position,$http,$rootScope,Notification,sincronizarService) {
    $scope.initialize = function(){

        var mensagens = $rootScope.mensagens;
        $rootScope.mensagens.forEach(function(mensagem){
            $rootScope.lib.insert("mensagensvendedor", {mensagem_id: mensagem.id, vendedor_id: mensagem.vendedor_id});            
        });
        sincronizarService.sincronizar();
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