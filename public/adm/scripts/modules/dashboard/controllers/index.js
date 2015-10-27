'use strict';

app.controller('DashboardCtrl', function($scope,$position,$http,$rootScope,Notification) {
    $scope.initialize = function(){
        var datas = [];
        var datas_graph = [];
        datas.push(moment().subtract(7, 'days').format('DD/MM/YYYY'));
        datas.push(moment(datas[0],'DD/MM/YYYY').format('DD/MM'))
        for (var i = 1; i < 60; i++) {
            datas[i] = moment(datas[i-1],'DD/MM/YYYY').add(1,'days').format('DD/MM/YYYY');
            datas_graph[i] = moment(datas[i],'DD/MM/YYYY').format('DD/MM');
        };

        var meses_graph = [];
        meses_graph.push(moment().subtract(1,'months').format('MMM'));
        meses_graph.push(moment().format('MMM'));
        meses_graph.push(moment().add(1,'months').format('MMM'));
        var meses = [];
        meses.push(moment().subtract(1,'months').format('YYYY-MM'));
        meses.push(moment().format('YYYY-MM'));
        meses.push(moment().add(1,'months').format('YYYY-MM'));
        console.log(meses);
        $scope.initGrafs();

        $http.get("/admin/produtovenda").then(function(result) {
            var produtosVenda = result.data;
            //GET MetaxValor Diario
            $http.get("/admin/meta/valor/all").then(function(metas) {
                console.log(produtosVenda);
                console.log(metas.data);
                var metas_mensal = metas.data.metas_mensal;
                var metas_mensal_graph = [];
                var valorMensal = [];
                angular.forEach(meses,function(mes,key){
                    var entrou_meta_mensal = false;
                    angular.forEach(metas_mensal,function(meta_mensal,key){
                        if (moment(mes,'YYYY-MM').isSame(moment(meta_mensal.mes,'YYYY-MM'))) {
                            metas_mensal_graph.push(meta_mensal.valor);
                            entrou_meta_mensal = true;
                        };
                    })
                    if (!entrou_meta_mensal) {
                        metas_mensal_graph.push(null);
                    };
                    var entrouValorMensal = false;
                    var valorTotal = 0;
                    angular.forEach(produtosVenda,function(produtoVenda , key){
                        if (moment(produtoVenda.data,'YYYY-MM').isSame(moment(mes,'YYYY-MM'))) {
                            angular.forEach(produtoVenda.produto_venda,function(produto_venda,key){
                                valorTotal += produto_venda.produto.valor;
                            })
                            entrouValorMensal = true;
                        }
                    })
                    if (!entrouValorMensal) {
                        valorMensal.push(null);
                    }else{

                        valorMensal.push(valorTotal);
                    }
                })
                console.log(meses_graph);
                console.log(valorMensal);
                console.log(metas_mensal_graph);

                var metas_diario = metas.data.metas_diario;
                
                var metas_diario_graph = [];
                var produtosVenda_graph = [];
                angular.forEach(datas,function(data,key){
                    var entrou_metas_diario = false;
                    angular.forEach(metas_diario,function(meta_diario , key){
                        
                        if (moment(meta_diario.data,'YYYY-MM-DD').isSame(moment(data,'DD/MM/YYYY'))) {
                            metas_diario_graph.push(meta_diario.valor);
                            entrou_metas_diario = true;
                        }
                    })
                    var entrou_prodVenda = false;
                    var valorTotal = 0;
                    angular.forEach(produtosVenda,function(produtoVenda , key){
                        if (moment(produtoVenda.data,'YYYY-MM-DD').isSame(moment(data,'DD/MM/YYYY'))) {
                            angular.forEach(produtoVenda.produto_venda,function(produto_venda,key){
                                valorTotal += produto_venda.produto.valor;
                            })
                            console.log('ENTROu')
                            entrou_prodVenda = true;
                        }
                    })
                    if (!entrou_metas_diario) {
                        metas_diario_graph.push(null);
                    };
                    if (!entrou_prodVenda) {
                        produtosVenda_graph.push(null);
                    }else{

                        produtosVenda_graph.push(valorTotal);
                    }
                });
                console.log(metas_diario_graph)
                console.log(produtosVenda_graph)
                $scope.drawMetaValorDiario(datas_graph,metas_diario_graph,produtosVenda_graph);
                $scope.drawMetaValorMensal(meses_graph,metas_mensal_graph,valorMensal);
            });
            //GET MetaxValor Mensal
            $http.get("/admin/filial").then(function(result) {
            });
            //GET MetaxProd Diario
            $http.get("/admin/filial").then(function(result) {
                $scope.drawMetaProdDiario(result);
            });
            //GET MetaxProd Mensal
            $http.get("/admin/filial").then(function(result) {
                $scope.drawMetaProdMensal(result);
            });

        });

        //ToDo
        //Substituir o parametro DATA de cada objeto Cofing nas funções draw com o resultado do get
        //substituir também o parametro categories com a data/mes
        //A configuração de cada objeto é grande, tem bastante parâmetro igual que dá pra fazer um obj padrao e chamar nos outros
        //mas eu to capotando e nem fiz isso ahusdhufahusd, mas é bem sussa de configurar
        //esse é a diretiva do hightcharts que to usando pro angular -> https://github.com/pablojim/highcharts-ng
    }


    $scope.drawMetaProdDiario = function(metas,produtosVenda){


        $scope.metaProdDiarioConfig = {
          title:{
            text:'Meta x Produto - Diário'
          },
          series:[
            {   
                data:[1],
                name:'META',
                color:'#004953'
            },
            {   
                data:[10,14,9,15],
                name:'PRODUTOS',
                color:'#d44950'
            }
          ],
          size:{
            height:200
          },
        };

        $scope.metaProdDiarioConfig.options={
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
                    enabled:false
                },
                labels:{
                    style:{
                        color:'#000'
                    },
                    enabled:true,  
                },
                
            },
            xAxis:{
                categories:[1],
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
    $scope.drawMetaProdMensal = function(result){

        $scope.metaProdMensalConfig = {
          //This is the Main Highcharts chart config. Any Highchart options are valid here.
          //will be overriden by values specified below.
          title:{
            text:'Meta x Produto - Mensal'
          },
          series:[
            {   
                data:[12,13,14,15],
                name:'META',
                color:'#004953'
            },
            {   
                data:[10,14,9,15],
                name:'PRODUTOS',
                color:'#d44950'
            }
          ],
          size:{
            height:200
          },
        };

        $scope.metaProdMensalConfig.options={
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
                    enabled:false
                },
                labels:{
                    style:{
                        color:'#000'
                    },
                    enabled:true,  
                },
                
            },
            xAxis:{
              categories:['Setembro','Outubro','Novembro','Dezembro',],
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

    $scope.drawMetaValorDiario = function(datas,metas,produtosVenda){


        $scope.metaValorDiarioConfig = {
          //This is the Main Highcharts chart config. Any Highchart options are valid here.
          //will be overriden by values specified below.
          title:{
            text:'Meta x Valor - Diário'
          },
          series:[
            {   
                data:metas,
                name:'META',
                color:'#004953'
            },
            {   
                data:produtosVenda,
                name:'VALOR',
                color:'#d44950'
            }
          ],
          size:{
            height:200
          },
        };

        $scope.metaValorDiarioConfig.options={
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
                    enabled:false
                },
                labels:{
                    style:{
                        color:'#000'
                    },
                    enabled:true,  
                },
                
            },
            xAxis:{
              categories:datas,
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
    $scope.drawMetaValorMensal = function(meses,metas,valor){
        $scope.metaValorMensalConfig = {
          //This is the Main Highcharts chart config. Any Highchart options are valid here.
          //will be overriden by values specified below.
          title:{
            text:'Meta x Valor - Mensal'
          },
          series:[
            {   
                data:metas,
                name:'META',
                color:'#004953'
            },
            {   
                data:valor,
                name:'VALOR',
                color:'#d44950'
            }
          ],
          size:{
            height:200
          },
        };

        $scope.metaValorMensalConfig.options={
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
                    enabled:false
                },
                labels:{
                    style:{
                        color:'#000'
                    },
                    enabled:true,  
                },
                
            },
            xAxis:{
              categories:meses,
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

    $scope.initGrafs = function(){
        var padrao = {
          title:{
            text:null
          },
          series:[],
          size:{
            height:200
          },
        };
        padrao.options = {
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
                    enabled:false
                },
                labels:{
                    style:{
                        color:'#ffffff'
                    },
                    enabled:false,  
                },
                
            },
            xAxis:{
                tickColor: 'transparent',

                lineColor:'transparent',
                labels:{
                    style:{
                        color:'#ffffff'
                    },  

                },
            }
        };
        $scope.metaProdDiarioConfig = padrao;
        $scope.metaProdMensalConfig = padrao;
        $scope.metaValorDiarioConfig = padrao;
        $scope.metaValorMensalConfig = padrao; 
        }


    $scope.initialize();
});