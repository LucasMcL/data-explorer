const app = angular.module('DataExplorer',
  ['ngRoute',
  'ng-fusioncharts',
  'ui.grid',
  'ngAnimate',
  'ngTouch',
  'ui.grid.autoResize',
  'ui.grid.resizeColumns',
  'ui.grid.moveColumns'])

// Config
app.config(($routeProvider, $locationProvider) => {
  console.log('Config executing')

  $locationProvider.hashPrefix('')

  $routeProvider
    .when('/', {
      controller: 'HomeCtrl',
      templateUrl: '/app/components/home/homeView.html',
    })
    // TODO: add resolve method for loading saved datasets
    .when('/saved', {
      controller: 'SavedCtrl',
      templateUrl: '/app/components/saved/savedView.html',
      resolve: {
        datasets (HttpFact) {
          return HttpFact.getAllDatasets()
        }
      }
    })
})
