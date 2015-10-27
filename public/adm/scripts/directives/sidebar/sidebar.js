'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
  .directive('sidebar',[function() {
    return {
      templateUrl:'scripts/directives/sidebar/sidebar.html',
      restrict: 'E',
      replace: true,
      scope: {
      },
      controller:function($scope,$rootScope,$state,$http){
        $scope.init = function(name){
          $scope.selectedMenu = 'dashboard';
          $scope.collapseVar = 0;
          $scope.multiCollapseVar = 0;

          $scope.showCadastrarGerentes = ($scope.getCookie('tipo')=='admin')?true:false;
          $scope.showCadastrarVendedores = true;
          $scope.showCadastrarFiliais =  ($scope.getCookie('tipo')=='admin')?true:false;
          $scope.showCadastrarMetas = true;
          $scope.showCadastrarProdutos = true;
          $scope.showCadastrarMensagens = true;


        }
        $scope.getCookie = function(name){
          var value = "; " + document.cookie;
          var parts = value.split("; " + name + "=");
          if (parts.length == 2) return parts.pop().split(";").shift();
        }
        
        $scope.check = function(x){
          if(x==$scope.collapseVar)
            $scope.collapseVar = 0;
          else
            $scope.collapseVar = x;
        };
        
        $scope.multiCheck = function(y){
          
          if(y==$scope.multiCollapseVar)
            $scope.multiCollapseVar = 0;
          else
            $scope.multiCollapseVar = y;
        };

        $scope.init();
      }
    }
  }]);
