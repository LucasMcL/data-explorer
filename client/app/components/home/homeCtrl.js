//TODO:
//  Figure out how to save dataset and chart
//  Save entire $scope.grid object and $scope.chartSource object

// Step 1: save dataset
// Step 2: Login logic on front end
//           isAuthenticated()
//           Modal


//  User clicks on "Save dataset"
//    Checks to see if logged in (with cookie?)
//      Redirects to login page if not
//      Redirects back to home after login
//        Need to make sure we don't lose current state of workspace after navigating away and back
//      User can then click "Save dataset" again
//    If already logged in, simply makes post to database and doesn't change veiws
//
//  [OPTIONAL]
//  User clicks on "Save graph"
//    Checks to see if logged in (with cookie?)
//      Redirects to login page if not
//      Redirects back to home after login
//        Need to make sure we don't lose current state of workspace after navigating away and back
//      User can then click "Save graph" again
//    If already logged in, simply makes post to database and doesn't change views
//
//

app.controller('HomeCtrl', function($scope, $rootScope, $compile, uiGridConstants, HomeFact) {
  console.log('Home control instantiated')

  // grid data and options
  $scope.grid = {
    columnDefs: [],
    data: [],
    enableHorizontalScrollbar: 2, // will be enabled when needed
    enableFiltering: true,

    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    },
  }

  // chart data and options
  $scope.chartSource = {
    chart: {
      exportEnabled: 1
    },
    data: []
  }

  $scope.chartType; $scope.chartTypeShow // The graph to show when user clicks plot

  // Read file on file input event
  $('#file-input').change(importData)

  // Modal activation / closing
  $('.trigger-login').click(showLoginModal)
  $('.trigger-register').click(showRegisterModal)

  function showLoginModal(evt) {
    $('#register-modal').modal('hide')
    $('#login-modal').modal()
  }
  function showRegisterModal(evt) {
    $('#login-modal').modal('hide')
    $('#register-modal').modal()
  }


  // Read CSV file, convert to array of objects and attach to scope
  // Attach column names to columnDefs
  // If first var is blank, replace with var name "row"
  // Scope refresh and ui grid refresh
  function importData(evt) {
    console.log('upload')
    let file = evt.target.files[0]
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function(event) {
      let csvData = event.target.result
      if(csvData.slice(0, 3) === `"",`) {
        csvData = `"id",` + csvData.slice(3)
      }
      const parsedData = $.csv.toObjects(csvData)
      const convertedData = HomeFact.convertData(parsedData)
      $scope.grid.data = convertedData
      assignColumnDefs(convertedData[0])
      $scope.$apply()
    } // end onLoad
    reader.onerror = function() {
      console.log('error reading file')
    }
  }

  $scope.updateChart = function(chartType) {
    $scope.chartType = chartType
  }

  $scope.createPlot = function() {
    console.log('create plot')

    let chartType = $scope.chartType,
        xVar = $scope.xVar.field,
        yVar = $scope.yVar.field

    if (!chartType) return alert('Please select chart type')
    if (!xVar) return alert('Please select X (labels) variable')
    if (!yVar) return alert('Please select Y (values) variable')

    if(chartType === "scatter") return createScatterplot(chartType, xVar, yVar)
    else return createLabelValueChart(chartType, xVar, yVar)
  }

  function createLabelValueChart(chartType, xVar, yVar) {
    resetChart()
    $scope.gridApi.core.getVisibleRows().forEach(rowInfo => {
      row = rowInfo.entity
      let datum = {}
      datum.label = row[xVar]
      datum.value = row[yVar]
      $scope.chartSource.data.push(datum)
    })
    $scope.chartSource.chart.xAxisName = xVar
    $scope.chartSource.chart.yAxisName = yVar

    $scope.chartTypeShow = $scope.chartType
  }

  function createScatterplot(chartType, xVar, yVar) {
    resetChart()
    $scope.chartSource.dataset = [{showRegressionLine: 1, data: []}]
    $scope.chartSource.chart.xAxisName = xVar
    $scope.chartSource.chart.yAxisName = yVar
    $scope.gridApi.core.getVisibleRows().forEach(rowInfo => {
      row = rowInfo.entity
      let datum = {}
      datum.x = row[xVar]
      datum.y = row[yVar]
      $scope.chartSource.dataset[0].data.push(datum)
    })

    $scope.chartTypeShow = $scope.chartType
  }

  // reset chartSource data, dataset, and chart properties
  function resetChart() {
    $scope.chartSource = {
      chart: {
        exportEnabled: 1
      },
      data: []
    }
  }
})











