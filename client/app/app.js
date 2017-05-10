const app = angular.module('DataExplorer', ['ngRoute', 'ng-fusioncharts'])

// Config
app.config(($routeProvider) => {
  console.log('Config executing')

  $routeProvider
    .when('/', {
      controller: 'HomeCtrl',
      templateUrl: '/app/components/home/homeView.html',
    })
})
