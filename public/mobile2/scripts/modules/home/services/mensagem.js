'use strict';

app.service('mensagemService', function($rootScope,$resource,$http) {
    var list = 0;

    var atualizarMensagensNaoLidas = function(qtde){
        $rootScope.mensagensNaoLidas = qtde;
    }
    var atualizarMensagens = function(mensagens){
        $rootScope.mensagens = mensagens;
    }
    return {
        atualizarMensagensNaoLidas: atualizarMensagensNaoLidas,
        atualizarMensagens: atualizarMensagens,
    }
});