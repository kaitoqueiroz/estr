'use strict';

app.service('mensagemService', function($rootScope,$resource,$http, Notification) {
    var list = 0;

    var atualizarMensagensNaoLidas = function(qtde){
        $rootScope.mensagensNaoLidas = qtde;
        if(qtde>0){
            Notification.success({
                message: "<a href='#/mensagens'><i class='fa fa-envelope-o'></i>&nbsp;&nbsp;Você possui novas mensagens.</a>", 
                replaceMessage: true, 
                delay: 60000 });
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