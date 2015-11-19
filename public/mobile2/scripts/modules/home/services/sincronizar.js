'use strict';

app.service('sincronizarService', function($rootScope,$resource,$http,mensagemService,Notification) {
    var lib = new localStorageDB("database", localStorage);
    $rootScope.lib = lib;
    if( lib.isNew() ) {
        lib.createTable("mensagens", ["id", "mensagem", "sender", "cod_mensagem", "vendedor_id", "created_at"]);
        lib.createTable("mensagensvendedor", ["mensagem_id","vendedor_id"]);
        lib.createTable("produtos", ["id", "cod_produto", "descricao", "valor"]);
        lib.createTable("vendedor", ["id", "nome"]);
        lib.createTable("metas", ["id", "tipo", "de", "ate", "valor"]);
        lib.createTable("produtosmeta", ["id", "quantidade", "meta_id", "produto_id"]);
        lib.createTable("vendas", ["id","cod_venda", "vendedor_id", "data"]);
        lib.createTable("produtosvenda", ["produto_id", "venda_id", "cod_venda", "quantidade"]);
        lib.createTable("atendimentos", ["vendedor_id", "produto_id", "motivo", "outro_dia", "created_at"]);
        lib.commit();
    }

    var getDB = function(){
        return lib;
    }

    var sincronizar = function(){
        var dados_sync = {};
        dados_sync.vendas = lib.queryAll("vendas");
        dados_sync.produtosvenda = lib.queryAll("produtosvenda");
        dados_sync.mensagensvendedor = lib.queryAll("mensagensvendedor");
        dados_sync.mensagens = lib.queryAll("mensagens");
        dados_sync.atendimentos = lib.queryAll("atendimentos");
        
        // $http.post("/sincronizar/"+localStorage.usuario,{
        $http.post("http://104.131.24.32:81/sincronizar/"+localStorage.usuario,{
            dados_sync:dados_sync
        }).then(function(result){
            lib.truncate("atendimentos");
            lib.truncate("mensagens");
            lib.truncate("mensagensvendedor");
            lib.truncate("produtos");
            lib.truncate("vendedor");
            lib.truncate("metas");
            lib.truncate("produtosmeta");
            lib.truncate("vendas");
            lib.truncate("produtosvenda");

            var vendedor = result.data.vendedor[0];

            result.data.mensagens.forEach(function(obj){
                lib.insert("vendedor", {id: vendedor.id, nome: vendedor.nome});
            });

            result.data.mensagens.forEach(function(obj){
                lib.insert("mensagens", {
                    id: obj.id, 
                    vendedor_id: obj.vendedor_id, 
                    mensagem: obj.mensagem, 
                    sender: obj.sender, 
                    cod_mensagem: obj.cod_mensagem, 
                    created_at: moment(obj.created_at).format("DD/MM/YYYY HH:mm:ss")
                });

                obj.mensagens_vendedor.forEach(function(obj2){
                    lib.insert("mensagensvendedor", {mensagem_id: obj.id, vendedor_id: obj2.vendedor_id});
                });
            });
            result.data.produtos.forEach(function(obj){
                lib.insert("produtos", {id: obj.id, cod_produto: obj.cod_produto, descricao: obj.descricao, valor: obj.valor});
            });
            result.data.metas.forEach(function(obj){
                lib.insert("metas", {id: obj.id, tipo: obj.tipo, de: obj.de, ate: obj.ate, valor: obj.valor});

                obj.produtos_meta.forEach(function(obj2){
                    lib.insert("produtosmeta", {id: obj2.id, quantidade: obj2.quantidade, meta_id: obj2.meta_id, produto_id: obj2.produto_id});
                });
            });
            result.data.vendas.forEach(function(obj){
                lib.insert("vendas", {id: obj.id, cod_venda: obj.cod_venda, vendedor_id: obj.vendedor_id, data: obj.data});
                obj.produtos_venda.forEach(function(obj2){
                    lib.insert("produtosvenda", {id: obj2.id, quantidade: obj2.quantidade, venda_id: obj2.venda_id,cod_venda: obj.cod_venda, produto_id: obj2.produto_id});
                });
            });

            var mensagens = lib.queryAll("mensagens");
            var qtdeMensagens = mensagens.length;
            var mensagensLidas = lib.queryAll("mensagensvendedor").length;
            mensagemService.atualizarMensagensNaoLidas((qtdeMensagens - mensagensLidas));
            mensagemService.atualizarMensagens(mensagens);

            $rootScope.vendas = lib.queryAll("vendas");
            $rootScope.produtosvenda = lib.queryAll("produtosvenda");
            $rootScope.vendedor = lib.queryAll("vendedor")[0];
            $rootScope.metas = lib.queryAll("metas");
            $rootScope.produtos = lib.queryAll("produtos");
            $rootScope.produtosmeta = lib.queryAll("produtosmeta");
        });
    }
    return {
        sincronizar: sincronizar,
        getDB: getDB,
    }
});