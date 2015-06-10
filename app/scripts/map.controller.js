'use strict';
angular.module('nsTrial.controllers')
  .controller('MapCtrl', function ($scope, historicalImages, nsImagesService, nsUserDataService) {
    $scope.defaults = {
      tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      maxZoom: 14,
      path: {
        weight: 10,
        color: '#800000',
        opacity: 1
      }
    };

    $scope.center = {
      lat: 51.353906,
      lng: -2.983046,
      zoom: 30
    };

    $scope.$on('leafletDirectiveMarker.click', function(e, args) {
      console.log(e);
      console.log("Leaflet Click");
    });

    function setMyPositionOnMap(position) {
      $scope.markers.me = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    }

    function setImageMarkers() {
      $scope.markers = {};
      for (var i = 0; i < historicalImages.length; i++) {
        var point = historicalImages[i];
        var ref = point[nsImagesService.CONSTANTS.REF];
        $scope.markers[ref] = {
          lat: parseFloat(point[nsImagesService.CONSTANTS.LAT]),
          lng: parseFloat(point[nsImagesService.CONSTANTS.LNG]),
          message: point[nsImagesService.CONSTANTS.DESC],
          metaData: {
            found: nsUserDataService.isPointFound(point)
          }
        };
      }
    }

    setImageMarkers();

    navigator.geolocation.getCurrentPosition(function (position) {
      setMyPositionOnMap(position);
    });
    navigator.geolocation.watchPosition(function (position) {
      setMyPositionOnMap(position);
    });

  });
