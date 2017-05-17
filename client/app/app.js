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
      redirectTo: '/workspace'
    })
    // TODO: add resolve method for loading saved datasets
    .when('/saved', {
      controller: 'SavedCtrl',
      templateUrl: '/app/components/saved/savedView.html',
      resolve: {
        datasets: HttpFact => {
          return HttpFact.getAllDatasets()
        }
      }
    })
    .when('/workspace', {
      controller: 'HomeCtrl',
      templateUrl: '/app/components/home/homeView.html',
      resolve: {
        dataset: () => {
          return Promise.resolve(null)
        }
      }
    })
    .when('/workspace/:datasetId', {
      controller: 'HomeCtrl',
      templateUrl: '/app/components/home/homeView.html',
      resolve: {
        dataset: (HttpFact, $route, $location) => {
          const id = $route.current.params.datasetId
          return HttpFact.getDataset(id)
                   .then(response => response.data.dataset)
                   .catch(() => $location.url('/workspace'))
        }
      }
    })
    .otherwise({
      redirectTo: '/workspace'
    })
})






