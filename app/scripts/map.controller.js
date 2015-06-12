'use strict';
angular.module('nsTrial.controllers')
  .controller('MapCtrl', function ($scope, historicalImages, nsImagesService, nsUserDataService, $ionicModal) {
    $scope.defaults = {
      tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      path: {
        weight: 10,
        color: '#800000',
        opacity: 1
      }
    };

    var markerIcons = {
      notFoundIcon: {
        type: 'awesomeMarker',
        icon: 'question',
        prefix: 'fa',
        markerColor: 'grey'
      },
      foundIcon: {
        type: 'awesomeMarker',
        icon: 'tick',
        prefix: 'fa',
        markerColor: 'green'
      },
      meIcon: {
        type: 'awesomeMarker',
        icon: 'dot-circle-o',
        prefix: 'fa',
        markerColor: 'blue'
      }
    };

    $scope.center = {
      lat: 51.353906,
      lng: -2.983046,
      zoom: 14
    };

    $scope.$on('leafletDirectiveMarker.click', function (e, args) {
      if (!args.model || args.model.me) {
        // This is the user marker
        return;
      }
      var template = 'templates/notFoundModal.html';
      var scope = $scope.$new(true);
      scope.model = args.model;

      if (args.model.metaData.found) {
        template = 'templates/foundModal.html';
      }
      $ionicModal.fromTemplateUrl(template, {
        scope: scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        scope.modal = modal;
        scope.modal.show();
        scope.close = function () {
          scope.modal.hide();
        }
      });
      // Make sure we clean up
      scope.$on('modal.hidden', function () {
        scope.$destroy();
      });
      scope.$on('$destroy', function () {
        scope.modal.remove();
      });

    });

    function setMyPositionOnMap(position) {
      $scope.markers.me = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        icon: markerIcons.meIcon,
        me: true
      };
    }

    function setImageMarkers() {
      $scope.markers = {};
      for (var i = 0; i < historicalImages.length; i++) {
        var point = historicalImages[i];
        var ref = point[nsImagesService.CONSTANTS.REF];
        var found = nsUserDataService.isPointFound(point);
        $scope.markers[ref] = {
          lat: parseFloat(point[nsImagesService.CONSTANTS.LAT]),
          lng: parseFloat(point[nsImagesService.CONSTANTS.LNG]),
          icon: found ? markerIcons.foundIcon : markerIcons.notFoundIcon,
          metaData: {
            found: found,
            full: point
          }
        };
      }
    }

    setImageMarkers();

    navigator.geolocation.getCurrentPosition(function (position) {
      setMyPositionOnMap(position);
      $scope.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        zoom: 14
      };
    });

    navigator.geolocation.watchPosition(function (position) {
      setMyPositionOnMap(position);
    });

  });
