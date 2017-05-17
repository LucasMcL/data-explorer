app.controller('HomeCtrl', function($scope, $rootScope, $compile, uiGridConstants, HomeFact, HttpFact, dataset, $route) {
  console.log('Home control instantiated')

  // Initialize grid and chart options
  $scope.grid = {
    columnDefs: [],
    data: [],
    enableHorizontalScrollbar: 2, // will be enabled when needed
    enableFiltering: true,

    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    },
  }

  $scope.chartSource = {
    chart: {
      exportEnabled: 1
    },
    data: []
  }

  $scope.chartType; $scope.chartTypeShow // The graph to show when user clicks plot

  if(dataset) {
    console.log('Here is the dataset: ', dataset)
    preloadData(dataset)
  }
  else console.log('No dataset')

  // Read file on file input event
  $('#file-input').change(importData)

  function preloadData(dataset) {
    console.log('preloading data')
    $scope.grid.data = dataset.data
    $scope.grid.columnDefs = HomeFact.generateColumnDefs(dataset.data[0])
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
      $scope.grid.columnDefs = HomeFact.generateColumnDefs(convertedData[0])
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

  $scope.triggerSaveModal = function() {
    if($scope.grid.data.length === 0) return alert('No data to save')
    $('#add-dataset-modal').modal()
  }

  $scope.saveDataset = function() {
    $('#add-dataset-modal').modal('hide')

    const name = $('#save-dataset-name').val(); $('#save-dataset-name').val('')
    const description = $('#save-dataset-description').val(); $('#save-dataset-description').val('')

    let postBody = {
      name: name,
      description: description,
      user_id: 1,
      data: angular.toJson($scope.grid.data)
    }

    HttpFact.addDataset(postBody)
      .then(response => console.log(response.data.id))
      .catch(response => {
        if(response.status === 413) return alert('Sorry, that file is too big')
        else if(response.status !== 200) return alert('There was an error processing your request.  Please try again later')
        else return alert('Successfully saved')
      })
  }
})











