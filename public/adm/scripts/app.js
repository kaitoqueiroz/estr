'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
var app = angular
	.module('sbAdminApp', [
		'ui-notification',
		'oc.lazyLoad',
		'ui.router',
		'ui.bootstrap',
		'ngRoute',
		'blockUI',
		'ui.utils.masks',
		'ui.mask',
		'highcharts-ng',
	])
	.run(function($rootScope, $http, $state){
		$rootScope.$on('$locationChangeSuccess', function(event, toState) {
			if(!getCookie("admin")){
		        $state.go("login");
		    }
		    function getCookie(name) {
		      var value = "; " + document.cookie;
		      var parts = value.split("; " + name + "=");
		      if (parts.length == 2) return parts.pop().split(";").shift();
		    }
	    });
	})
	.config(['blockUIConfig','NotificationProvider','$stateProvider','$urlRouterProvider','$routeProvider','$ocLazyLoadProvider','$httpProvider','$provide',
			function (blockUIConfig,NotificationProvider,$stateProvider,$urlRouterProvider,$routeProvider,$ocLazyLoadProvider,$httpProvider,$provide) {

		NotificationProvider.setOptions({
			delay: 10000,
			startTop: 100,
			startRight: 10,
			verticalSpacing: 20,
			horizontalSpacing: 20,
			positionX: 'right',
			positionY: 'top'
		});

		blockUIConfig.templateUrl = 'bower_components/angular-block-ui/angular-block-ui.html';
		
		$provide.factory('httpInterceptor',function ($q, $rootScope,$injector) {
	        return {
	            'request': function (config) {
	                // intercept and change config: e.g. change the URL
	                // config.url += '?nocache=' + (new Date()).getTime();
	                // broadcasting 'httpRequest' event
	                $rootScope.$broadcast('httpRequest', config);
	                return config || $q.when(config);
	            },
	            'response': function (response) {
	                // we can intercept and change response here...
	                // broadcasting 'httpResponse' event
	                $rootScope.$broadcast('httpResponse', response);
	                return response || $q.when(response);
	            },
	            'requestError': function (rejection) {
	                // broadcasting 'httpRequestError' event
	                $rootScope.$broadcast('httpRequestError', rejection);
	                return $q.reject(rejection);
	            },
	            'responseError': function (rejection) {
	            	if(rejection.status == 401){
						var Notification = $injector.get('Notification');
	            		Notification.error("Erro: Permissão negada.");
	            	}
	            	if(rejection.status == 500){
						var Notification = $injector.get('Notification');
	            		Notification.error("Ocorreu um erro inesperado.");
	            	}
	            	if(rejection.status == 422){
						var Notification = $injector.get('Notification');
	            		Notification.error("Verifique os campos obrigatórios.");
	            	}
	                // broadcasting 'httpResponseError' event
	                $rootScope.$broadcast('httpResponseError', rejection);
	                return $q.reject(rejection);
	            }
	        };
	    });
	    $httpProvider.interceptors.push('httpInterceptor');

		$ocLazyLoadProvider.config({
			debug:false,
			events:false,
		});
		$stateProvider
			.state('dashboard', {
				reloadOnSearch:false,
				url:"",
				controller: 'MainCtrl',
				templateUrl: 'views/dashboard/main.html',
				resolve: {
					loadMyDirectives:function($ocLazyLoad){
						return $ocLazyLoad.load(
						{
							name:'sbAdminApp',
							files:[
								'scripts/controllers/main.js',
								'scripts/directives/pages/show-on-load.js',
								'scripts/directives/header/header.js',
								'scripts/directives/header/header-notification/header-notification.js',
								'scripts/directives/sidebar/sidebar.js',
								'scripts/directives/sidebar/sidebar-search/sidebar-search.js',
								'scripts/directives/sidebar/sidebar-icons/sidebar-icons.js',
								'bower_components/moment/min/moment.min.js',
							]
						}),
						$ocLazyLoad.load(
						{
							name:'toggle-switch',
							files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
								"bower_components/angular-toggle-switch/angular-toggle-switch.css"
							]
						}),
						$ocLazyLoad.load(
						{
							name:'ngResource',
							files:['bower_components/angular-resource/angular-resource.js']
						}),
						$ocLazyLoad.load(
						{
							name:'ngAnimate',
							files:['bower_components/angular-animate/angular-animate.js']
						})
						$ocLazyLoad.load(
						{
							name:'ngCookies',
							files:['bower_components/angular-cookies/angular-cookies.js']
						})
						$ocLazyLoad.load(
						{
							name:'ngSanitize',
							files:['bower_components/angular-sanitize/angular-sanitize.js']
						})
						$ocLazyLoad.load(
						{
							name:'ngTouch',
							files:['bower_components/angular-touch/angular-touch.js']
						})
					} 
				}
			})
			.state('dashboard.dashboard',{
				url:'/dashboard',
				controller:'DashboardCtrl',
				templateUrl:'scripts/modules/dashboard/view/index.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/dashboard/controllers/index.js',
							]
						})
					}
				}
			})			
			.state('dashboard.filiais',{
				url:'/filiais',
				controller:'FilialListCtrl',
				templateUrl:'scripts/modules/filiais/view/index.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/filiais/controllers/index.js',
							]
						})
					}
				}
			})
			.state('login',{
				url:'/login',
				controller:'LoginCtrl',
				templateUrl:'scripts/modules/login/view/login.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/login/controllers/login.js'
							]
						})		
					}
				}
			})
			.state('dashboard.filiais_create',{
				url:'/filiais/create',
				controller:'FilialCreateCtrl',
				templateUrl:'scripts/modules/filiais/view/create.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/filiais/controllers/create.js',
							]
						})
					}
				}
			})
			.state('dashboard.filiais_show',{
				url:'/filiais/show/:id',
				controller:'FilialShowCtrl',
				templateUrl:'scripts/modules/filiais/view/show.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/filiais/controllers/show.js',
							]
						})
					}
				}
			})
			.state('dashboard.filiais_edit',{
				url:'/filiais/edit/:id',
				controller:'FilialEditCtrl',
				templateUrl:'scripts/modules/filiais/view/edit.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/filiais/controllers/edit.js',
							]
						})
					}
				}
			})
			.state('dashboard.mensagens',{
				url:'/mensagens',
				controller:'MensagemListCtrl',
				templateUrl:'scripts/modules/mensagens/view/index.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/mensagens/controllers/index.js',
							]
						})
					}
				}
			})
			.state('dashboard.mensagens_create',{
				url:'/mensagens/create',
				controller:'MensagemCreateCtrl',
				templateUrl:'scripts/modules/mensagens/view/create.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/mensagens/controllers/create.js',
							]
						})
					}
				}
			})
			.state('dashboard.mensagens_show',{
				url:'/mensagens/show/:id',
				controller:'MensagemShowCtrl',
				templateUrl:'scripts/modules/mensagens/view/show.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/mensagens/controllers/show.js',
							]
						})
					}
				}
			})
			.state('dashboard.mensagens_edit',{
				url:'/mensagens/edit/:id',
				controller:'MensagemEditCtrl',
				templateUrl:'scripts/modules/mensagens/view/edit.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/mensagens/controllers/edit.js',
							]
						})
					}
				}
			})
			.state('dashboard.metas',{
				url:'/metas',
				controller:'MetaListCtrl',
				templateUrl:'scripts/modules/metas/view/index.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/metas/controllers/index.js',
							]
						})
					}
				}
			})
			.state('dashboard.metas_create',{
				url:'/metas/create',
				controller:'MetaCreateCtrl',
				templateUrl:'scripts/modules/metas/view/create.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/metas/controllers/create.js',
							]
						})
					}
				}
			})
			.state('dashboard.metas_show',{
				url:'/metas/show/:id',
				controller:'MetaShowCtrl',
				templateUrl:'scripts/modules/metas/view/show.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/metas/controllers/show.js',
							]
						})
					}
				}
			})
			.state('dashboard.metas_edit',{
				url:'/metas/edit/:id',
				controller:'MetaEditCtrl',
				templateUrl:'scripts/modules/metas/view/edit.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/metas/controllers/edit.js',
							]
						})
					}
				}
			})
			.state('dashboard.vendas_list',{
				url:'/vendas_list',
				controller:'VendaListCtrl',
				templateUrl:'scripts/modules/vendas/view/index.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/vendas/controllers/index.js',
							]
						})
					}
				}
			})
			.state('dashboard.vendas_create',{
				url:'/vendas/create',
				controller:'VendaCreateCtrl',
				templateUrl:'scripts/modules/vendas/view/create.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/vendas/controllers/create.js',
							]
						})
					}
				}
			})
			.state('dashboard.vendas_show',{
				url:'/vendas/show/:id',
				controller:'VendaShowCtrl',
				templateUrl:'scripts/modules/vendas/view/show.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/vendas/controllers/show.js',
							]
						})
					}
				}
			})
			.state('dashboard.vendas_edit',{
				url:'/vendas/edit/:id',
				controller:'VendaEditCtrl',
				templateUrl:'scripts/modules/vendas/view/edit.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/vendas/controllers/edit.js',
							]
						})
					}
				}
			})
			.state('dashboard.vendedores',{
				url:'/vendedores',
				controller:'VendedorListCtrl',
				templateUrl:'scripts/modules/vendedores/view/index.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/vendedores/controllers/index.js',
							]
						})
					}
				}
			})
			.state('dashboard.vendedores_create',{
				url:'/vendedores/create',
				controller:'VendedorCreateCtrl',
				templateUrl:'scripts/modules/vendedores/view/create.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/vendedores/controllers/create.js',
							]
						})
					}
				}
			})
			.state('dashboard.vendedores_show',{
				url:'/vendedores/show/:id',
				controller:'VendedorShowCtrl',
				templateUrl:'scripts/modules/vendedores/view/show.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/vendedores/controllers/show.js',
							]
						})
					}
				}
			})
			.state('dashboard.vendedores_edit',{
				url:'/vendedores/edit/:id',
				controller:'VendedorEditCtrl',
				templateUrl:'scripts/modules/vendedores/view/edit.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/vendedores/controllers/edit.js',
							]
						})
					}
				}
			})
			.state('dashboard.gerentes',{
				url:'/gerentes',
				controller:'GerenteListCtrl',
				templateUrl:'scripts/modules/gerentes/view/index.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/gerentes/controllers/index.js',
							]
						})
					}
				}
			})
			.state('dashboard.gerentes_create',{
				url:'/gerentes/create',
				controller:'GerenteCreateCtrl',
				templateUrl:'scripts/modules/gerentes/view/create.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/gerentes/controllers/create.js',
							]
						})
					}
				}
			})
			.state('dashboard.gerentes_show',{
				url:'/gerentes/show/:id',
				controller:'GerenteShowCtrl',
				templateUrl:'scripts/modules/gerentes/view/show.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/gerentes/controllers/show.js',
							]
						})
					}
				}
			})
			.state('dashboard.gerentes_edit',{
				url:'/gerentes/edit/:id',
				controller:'GerenteEditCtrl',
				templateUrl:'scripts/modules/gerentes/view/edit.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/gerentes/controllers/edit.js',
							]
						})
					}
				}
			})
			.state('dashboard.produtos',{
				url:'/produtos',
				controller:'ProdutoListCtrl',
				templateUrl:'scripts/modules/produtos/view/index.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/produtos/controllers/index.js',
							]
						})
					}
				}
			})
			.state('dashboard.produtos_create',{
				url:'/produtos/create',
				controller:'ProdutoCreateCtrl',
				templateUrl:'scripts/modules/produtos/view/create.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/produtos/controllers/create.js',
							]
						})
					}
				}
			})
			.state('dashboard.produtos_show',{
				url:'/produtos/show/:id',
				controller:'ProdutoShowCtrl',
				templateUrl:'scripts/modules/produtos/view/show.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/produtos/controllers/show.js',
							]
						})
					}
				}
			})
			.state('dashboard.produtos_edit',{
				url:'/produtos/edit/:id',
				controller:'ProdutoEditCtrl',
				templateUrl:'scripts/modules/produtos/view/edit.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/produtos/controllers/edit.js',
							]
						})
					}
				}
			})
			.state('dashboard.alterar_senha',{
				url:'/alterar_senha',
				controller:'AlterarSenhaCtrl',
				templateUrl:'scripts/modules/login/view/alterarSenha.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/login/controllers/alterarSenha.js',
							]
						})
					}
				}
			})
			.state('dashboard.produtos_vendidos',{
				url:'/relatorios/produtos_vendidos',
				controller:'ProdutosVendidosCtrl',
				templateUrl:'scripts/modules/relatorios/view/produtosVendidos.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/relatorios/controllers/produtosVendidos.js',
							]
						})
					}
				}
			})
			.state('dashboard.vendas',{
				url:'/relatorios/vendas',
				controller:'VendasCtrl',
				templateUrl:'scripts/modules/relatorios/view/vendas.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/relatorios/controllers/vendas.js',
							]
						})
					}
				}
			})
			.state('dashboard.relatorio_metas',{
				url:'/relatorios/relatorio_metas:tipo_meta',
				controller:'RelatorioMetasCtrl',
				templateUrl:'scripts/modules/relatorios/view/relatorio_metas.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/relatorios/controllers/relatorio_metas.js',
							]
						})
					}
				}
			})
			.state('dashboard.relatorio_vendedores_produtos',{
				url:'/relatorios/relatorio_vendedores_produtos',
				controller:'RelatorioVendedoresProdutosCtrl',
				templateUrl:'scripts/modules/relatorios/view/relatorio_vendedores_produtos.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/relatorios/controllers/relatorio_vendedores_produtos.js',
							]
						})
					}
				}
			})
			.state('dashboard.relatorio_vendedores_metas',{
				url:'/relatorios/relatorio_vendedores_metas',
				controller:'RelatorioVendedoresMetasCtrl',
				templateUrl:'scripts/modules/relatorios/view/relatorio_vendedores_metas.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/relatorios/controllers/relatorio_vendedores_metas.js',
							]
						})
					}
				}
			})
			.state('dashboard.relatorio_vendedores_atendimento',{
				url:'/relatorios/relatorio_vendedores_atendimento',
				controller:'RelatorioVendedoresAtendimentoCtrl',
				templateUrl:'scripts/modules/relatorios/view/relatorio_vendedores_atendimento.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/relatorios/controllers/relatorio_vendedores_atendimento.js',
							]
						})
					}
				}
			})
			.state('dashboard.relatorio_filiais_metas',{
				url:'/relatorios/relatorio_filiais_metas',
				controller:'RelatorioFiliaisMetasCtrl',
				templateUrl:'scripts/modules/relatorios/view/relatorio_filiais_metas.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/relatorios/controllers/relatorio_filiais_metas.js',
							]
						})
					}
				}
			})
			.state('dashboard.relatorio_filiais_atendimento',{
				url:'/relatorios/relatorio_filiais_atendimento',
				controller:'RelatorioFiliaisAtendimentoCtrl',
				templateUrl:'scripts/modules/relatorios/view/relatorio_filiais_atendimento.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/relatorios/controllers/relatorio_filiais_atendimento.js',
							]
						})
					}
				}
			})
		}]
);
