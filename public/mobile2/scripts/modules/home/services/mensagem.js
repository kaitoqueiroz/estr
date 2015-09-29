'use strict';

app.service('mensagemService', function($rootScope,$resource,$http, Notification) {
    var list = 0;

    var atualizarMensagensNaoLidas = function(qtde){
        $rootScope.mensagensNaoLidas = qtde;
        if(qtde>0){
            Notification.success("<a href='#/mensagens'>Você possui novas mensagens.</a>");
        }
    }
    var atualizarMensagens = function(mensagens){
        $rootScope.mensagens = mensagens;
    }
    return {
        atualizarMensagensNaoLidas: atualizarMensagensNaoLidas,
        atualizarMensagens: atualizarMensagens,
    }
});