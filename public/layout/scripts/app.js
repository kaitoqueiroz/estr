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
				url:'',
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
								'bower_components/moment/min/locales.min.js',
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
		}]
);
