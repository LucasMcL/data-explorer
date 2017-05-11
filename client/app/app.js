const app = angular.module('DataExplorer', ['ngRoute', 'ng-fusioncharts', 'ui.grid', 'ngAnimate', 'ngTouch'])

// Config
app.config(($routeProvider, $locationProvider) => {
  console.log('Config executing')

  $locationProvider.hashPrefix('')

  $routeProvider
    .when('/', {
      controller: 'HomeCtrl',
      templateUrl: '/app/components/home/homeView.html',
    })
    .when('/saved', {
    	controller: 'SavedCtrl',
    	templateUrl: '/app/components/saved/savedView.html'
    })
})
