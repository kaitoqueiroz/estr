'use strict';

app.controller('AtendimentoCtrl', function($scope,$position,$http,$rootScope,Notification,sincronizarService) {
    $scope.motivos = [
        {descricao: "Estava só olhando"},
        {descricao: "Achou caro"},
        {descricao: "Mais barato no concorrente"},
        {descricao: "Não aprovou cadastro"}
    ];
    $scope.produto = {};
    $scope.motivo = {};
    $scope.lancarAtendimento = function () {
        var outro_dia = $scope.outro_dia;
        outro_dia = outro_dia.slice( 0, 2)+'/'+outro_dia.slice( 2, 4)+'/'+outro_dia.slice( 4, 8);
        var atendimento = {
            produto_id : $scope.produto.id,
            vendedor_id : $rootScope.vendedor.id,
            motivo : $scope.motivo.descricao,
            outro_dia : outro_dia,
            created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        $rootScope.lib.insert("atendimentos", atendimento);
        Notification.success("Lançamento do atendimento realizado com sucesso.");

        window.location = "#/home";
    }
});