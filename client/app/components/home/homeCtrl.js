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
  $scope.title

  if(dataset) {
    console.log('Here is the dataset: ', dataset)
    preloadData(dataset)
    $scope.title = dataset.name
  }
  else {
    $scope.title = 'Workspace'
    console.log('No dataset')
  }

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
      let convertedData = HomeFact.convertData(parsedData)
      convertedData = HomeFact.renameColumnsWithPeriods(convertedData)
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

    if (!$scope.chartType) return alert('Please select chart type')
    if (!$scope.xVar) return alert('Please select X (labels) variable')
    let chartType = $scope.chartType,
        xVar = $scope.xVar.field

    if(chartType === "histogram") return createHistogram(chartType, xVar)

    if (!$scope.yVar) return alert('Please select Y (values) variable')
    let yVar = $scope.yVar.field

    if(chartType === "scatter") return createScatterplot(chartType, xVar, yVar)
    else if(chartType === "boxandwhisker2d") return createBoxAndWhiskerPlot(chartType, xVar, yVar)
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
    $scope.chartSource.chart.caption = `${xVar} and ${yVar}`
    $scope.chartSource.chart.xAxisName = xVar
    $scope.chartSource.chart.yAxisName = yVar

    $scope.chartTypeShow = $scope.chartType
  }

  function createScatterplot(chartType, xVar, yVar) {
    resetChart()
    $scope.chartSource.dataset = [{showRegressionLine: 1, data: []}]
    $scope.chartSource.chart.caption = `${xVar} and ${yVar}`
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

  function createBoxAndWhiskerPlot(chartType, xVar, yVar) {
    resetChart()
    $scope.chartSource.categories = [{category: []}]
    $scope.chartSource.dataset = [{data: []}]
    $scope.chartSource.chart.caption = `${xVar} and ${yVar}`
    $scope.chartSource.chart.xAxisName = String(xVar)
    $scope.chartSource.chart.yAxisName = String(yVar)
    let data = $scope.gridApi.core.getVisibleRows()
    let arrayOfUniqueXVars = []
    data.forEach(rowInfo => {
      let row = rowInfo.entity
      if(!arrayOfUniqueXVars.includes(row[xVar])) arrayOfUniqueXVars.push(row[xVar])
    })
    // Create category labels
    arrayOfUniqueXVars.forEach(uniqueVar => {
      $scope.chartSource.categories[0].category.push({
        label: String(uniqueVar)
      })
    })
    // Create strings of values and push to "data" array
    arrayOfUniqueXVars.forEach(uniqueVar => {
      values = ""
      data.forEach(rowInfo => {
        let row = rowInfo.entity
        if(isNaN(row[yVar])) return
        if(row[xVar] === uniqueVar) values += (String(row[yVar]) + ',')
      })
      $scope.chartSource.dataset[0].data.push({value: values.slice(0, -1)})
    })
    console.log($scope.chartSource)
    $scope.chartTypeShow = chartType
  }

  function createHistogram(chartType, xVar) {
    const NUM_OF_BINS = 5
    resetChart()
    $scope.chartSource.chart.caption = `frequency of ${xVar}`
    $scope.chartSource.chart.xAxisName = xVar
    let data = $scope.gridApi.core.getVisibleRows()

    // Find min / max value of xVar
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY
    let tmp
    for (var i = 0; i < data.length; i++) {
      row = data[i].entity
      tmp = row[xVar]
      if(isNaN(tmp)) continue
      if(tmp < min) min = tmp
      if(tmp > max) max = tmp
    }

    let binWidth = Number(((max - min) / NUM_OF_BINS).toFixed(1))
    // Sum number of instances in each bin
    let totals = []
    for(let i = 0; i < NUM_OF_BINS; i++) {
      let total = 0
      const BIN_LOWER = min + (i * binWidth),
            BIN_UPPER = min + ((i+1) * binWidth)
      data.forEach(rowInfo => {
        let row = rowInfo.entity,
            value = row[xVar]
        if(value >= BIN_LOWER && value < BIN_UPPER) total++
        if(i === NUM_OF_BINS - 1 && value === BIN_UPPER) total++
      })
      totals.push(total)
    }

    totals.forEach((total, i) => {
      let datum = {}
      datum.label = (min + (i * binWidth)).toFixed(1) + " - " + (min + ((i+1) * binWidth)).toFixed(1)
      datum.value = total
      $scope.chartSource.data.push(datum)
    })

    $scope.chartTypeShow = 'column2d'
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











