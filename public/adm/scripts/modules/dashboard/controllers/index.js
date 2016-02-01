'use strict';

app.controller('DashboardCtrl', function($scope,$position,$http,$rootScope,Notification) {
    $scope.initialize = function(){
        $scope.loadChart = false;

        $scope.$watch('loadChart', function() {
            if($scope.loadChart == true){
                $scope.drawMetaProdDiario([]);
                console.log($scope.metaProdDiarioConfig);
            }
        });

        var meses = [];
        for(var i=11;i>=0;--i){
            meses.push(moment().add(-i,'months').format("YYYY-MM"));
        }
        $scope.dados_chart = [];
        $scope.dados_chart.meta = {
            data:[],
            name:'Meta',
            color:'#004953'
        }
        $scope.dados_chart.produtos = {   
            data:[],
            name:'Meta Produtos',
            color:'#d44950'
        }
        $scope.dados_chart.financeira = {   
            data:[],
            name:'Meta Financeira',
            color:'#d48930'
        }
        var mesesCarregados = [];

        var x = 0;
        meses.forEach(function(mes){
            var data_meta = {
                x: ++x,
                name: moment(mes,"YYYY-MM").format("MM/YYYY")
            }
            var data_produtos = {
                x: x,
                name: moment(mes,"YYYY-MM").format("MM/YYYY")
            }
            var data_financeira = {
                x: x,
                name: moment(mes,"YYYY-MM").format("MM/YYYY")
            }
            $scope.dados_chart.meta.data.push(data_meta);
            $scope.dados_chart.produtos.data.push(data_produtos);
            $scope.dados_chart.financeira.data.push(data_financeira);

            var filial = $scope.getCookie('filial');
            var result = null;
            if(filial){
                result = $http.get("/metas_filial",{
                    params: {
                        mes: mes,
                        filial_id: filial
                    }
                });
            }else{
                result = $http.get("/metas_filial",{
                    params: {
                        mes: mes
                    }
                });
            }

            result.then(function(res) {
                console.log(res);
                data_meta.y = res.data.dados.valor_total;
                data_produtos.y = res.data.dados.valor_total_meta;
                data_financeira.y = res.data.dados.valor_total_financeira;



                mesesCarregados.push(mes);
                if(mesesCarregados.length == 12){
                    $scope.loadChart = true;
                }
            });
        });
    }


    $scope.drawMetaProdDiario = function(metas,produtosVenda){
        $scope.metaProdDiarioConfig = {
          title:{
            text:'Metas'
          },
          series:[
            $scope.dados_chart.meta,
            $scope.dados_chart.produtos,
            $scope.dados_chart.financeira
          ],
          size:{
            height:500
          },
        };

        $scope.metaProdDiarioConfig.options={
            tooltip: {
                pointFormat: "Valor: R$ {point.y:,.2f}"
            },
            chart:{
                backgroundColor: 'transparent',
                type:'spline',
            },
            legend:{
                align:'left',
            },
            yAxis:{
                gridLineColor: 'transparent',
                title:{
                    text: 'Valor'
                },
                labels:{
                    style:{
                        color:'#000'
                    },
                    formatter: function() {
                        return "R$ "+(this.value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ');
                    },
                    enabled:true,  
                },
                
            },
            xAxis:{
                categories:[2],
                tickColor: 'transparent',

                lineColor:'transparent',
                labels:{
                    style:{
                        color:'#000'
                    },  

                },
            }
        };
    }
    $scope.getCookie = function(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }


    $scope.initialize();
});