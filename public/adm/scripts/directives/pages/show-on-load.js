'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
  .directive('showOnLoad', function() {
  return {
    restrict: 'A',
    link: function($scope,elem,attrs) {

      elem.hide();

      $scope.$on('show', function() {
        elem.show();
      });

    }
  }
});