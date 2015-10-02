'use strict';

app.controller('DashboardCtrl', function($scope,$position,$http,$rootScope,Notification) {
    $scope.initialize = function(){
        $scope.initGrafs();

        $http.get("/admin/produtovenda").then(function(result) {
            var produtovenda = result.data;
            //GET MetaxValor Diario
            $http.get("/admin/meta/valor/diario").then(function(result) {
                console.log(result);
                console.log(produtovenda);
                $scope.drawMetaValorDiario(result);
            });
            //GET MetaxValor Mensal
            $http.get("/admin/filial").then(function(result) {
                $scope.drawMetaValorMensal(result);
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


    $scope.drawMetaProdDiario = function(result){
        $scope.metaProdDiarioConfig = {
          title:{
            text:'Meta x Produto - Diário'
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
              categories:['06/07','07/07','08/07','09/07',],
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

    $scope.drawMetaValorDiario = function(result){
        $scope.metaValorDiarioConfig = {
          //This is the Main Highcharts chart config. Any Highchart options are valid here.
          //will be overriden by values specified below.
          title:{
            text:'Meta x Valor - Diário'
          },
          series:[
            {   
                data:[12,13,14,15],
                name:'META',
                color:'#004953'
            },
            {   
                data:[10,14,9,15],
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
              categories:['06/07','07/07','08/07','09/07',],
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
    $scope.drawMetaValorMensal = function(result){
        $scope.metaValorMensalConfig = {
          //This is the Main Highcharts chart config. Any Highchart options are valid here.
          //will be overriden by values specified below.
          title:{
            text:'Meta x Valor - Mensal'
          },
          series:[
            {   
                data:[12,13,14,15],
                name:'META',
                color:'#004953'
            },
            {   
                data:[10,14,9,15],
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