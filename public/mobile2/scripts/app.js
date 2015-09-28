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
	])
	.config(['blockUIConfig','NotificationProvider','$stateProvider','$urlRouterProvider','$routeProvider','$ocLazyLoadProvider','$httpProvider','$provide',
			function (blockUIConfig,NotificationProvider,$stateProvider,$urlRouterProvider,$routeProvider,$ocLazyLoadProvider,$httpProvider,$provide) {

		
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

		NotificationProvider.setOptions({
			delay: 10000,
			startTop: 50,
			startRight: 10,
			verticalSpacing: 20,
			horizontalSpacing: 20,
			positionX: 'right',
			positionY: 'top'
		});

		blockUIConfig.requestFilter = function(config) {
		  // If the request starts with '/api/quote' ...
		  /*if(config.url.indexOf("/sincronizar/")>-1) {
		    return false; // ... don't block it.
		  }*/
		};

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
	    $httpProvider.defaults.timeout = 5000;

		$ocLazyLoadProvider.config({
			debug:false,
			events:false,
		});
		$stateProvider
			.state('dashboard', {
				reloadOnSearch:false,
				url:'',
				controller: 'MainCtrl',
				templateUrl: 'views/dashboard/main.html',
				resolve: {
					loadMyDirectives:function($ocLazyLoad){
						return $ocLazyLoad.load(
						{
							name:'sbAdminApp',
							files:[
								'scripts/modules/home/services/mensagem.js',
								'scripts/modules/home/services/sincronizar.js',
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
			.state('dashboard.home',{
				url:'/home',
				controller:'HomeCtrl',
				templateUrl:'scripts/modules/home/view/index.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/home/controllers/index.js',
							]
						})
					}
				}
			})
			.state('dashboard.mensagens',{
				url:'/mensagens',
				controller:'MensagemCtrl',
				templateUrl:'scripts/modules/home/view/mensagens.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/home/controllers/mensagens.js',
							]
						})
					}
				}
			})
			.state('dashboard.lancar_venda',{
				url:'/lancar_venda',
				controller:'LancarVendaCtrl',
				templateUrl:'scripts/modules/home/view/lancar_venda.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/home/controllers/lancar_venda.js',
							]
						})
					}
				}
			})
			.state('dashboard.relatorios',{
				url:'/relatorios',
				controller:'RelatorioCtrl',
				templateUrl:'scripts/modules/home/view/relatorios.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/home/controllers/relatorios.js',
							]
						})
					}
				}
			})
			.state('dashboard.relatorios_list',{
				url:'/relatorios_list/:tipo',
				controller:'RelatorioListCtrl',
				templateUrl:'scripts/modules/relatorios/view/list.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/relatorios/controllers/list.js',
							]
						})
					}
				}
			})
			.state('dashboard.relatorios_meta_produto',{
				url:'/relatorios_meta_produto/:meta_id',
				controller:'RelatorioViewCtrl',
				templateUrl:'scripts/modules/relatorios/view/produto.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/relatorios/controllers/relatorio.js',
							]
						})
					}
				}
			})
			.state('dashboard.relatorios_meta_valor',{
				url:'/relatorios_meta_valor/:meta_id',
				controller:'RelatorioViewCtrl',
				templateUrl:'scripts/modules/relatorios/view/valor.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/relatorios/controllers/relatorio.js',
							]
						})
					}
				}
			})
			.state('login',{
				url:'/login',
				controller:'LoginCtrl',
				templateUrl:'scripts/modules/home/view/login.html',
				resolve: {
					loadMyFile:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'sbAdminApp',
							files:[
								'scripts/modules/home/services/mensagem.js',
								'scripts/modules/home/services/sincronizar.js',
								'scripts/modules/home/controllers/login.js',
							]
						}),
						$ocLazyLoad.load(
						{
							name:'ngResource',
							files:['bower_components/angular-resource/angular-resource.js']
						})			
					}
				}
			});
		}]
);
