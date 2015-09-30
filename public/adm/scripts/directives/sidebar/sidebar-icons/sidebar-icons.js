'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
  .directive('sidebarIcons',function() {
    return {
      templateUrl:'scripts/directives/sidebar/sidebar-icons/sidebar-icons.html',
      restrict: 'E',
      replace: true,
      scope: {
      },
      controller:function($scope,$http,$rootScope,notificacaoService){
        $scope.selectedMenu = 'home';

        notificacaoService.atualizarNotificacoesNaoLidas();
      }
    }
  });
