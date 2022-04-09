'use strict';
angular.module('app', ["ngRoute", "ngCookies"]).config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/benvenuto', {
        templateUrl: 'template/benvenuto.html',
        controller: 'controllerBenvenuto'
      })
      .when('/home', {
        templateUrl: 'template/home.html',
        controller: 'controllerHome'
      })
      .when('/creazione', {
        templateUrl: 'template/creazione.html',
        controller: 'controllerCreazione'
      })
      .when('/stanza', {
        templateUrl: 'template/stanza.html',
        controller: 'controllerStanza'
      })
      .otherwise({
        redirectTo: '/home'
      });
      
  }]);

