'use strict';

angular.module('nsTrial.directives', [])
  .directive('nsResult', function () {
  return {
    scope: {
      itemTitle: '=',
      itemContentHtml: '='
    },
    controller: function () {

    }
  }
});
