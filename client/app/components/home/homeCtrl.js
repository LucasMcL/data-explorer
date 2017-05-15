//TODO:
//  resetChart function
//  Labels for charts

app.controller('HomeCtrl', function($scope, $rootScope, $compile, uiGridConstants) {
  console.log('Home control instantiated')

  // Read file on file input event
  $('#file-input').change(upload)

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

  // save selected chartType here
  $scope.chartType

  // The graph to be shown when the user clicks create plot
  $scope.chartTypeShow

  // Read CSV file, convert to array of objects and attach to scope
  // Attach column names to columnDefs
  // If first var is blank, replace with var name "row"
  // Scope refresh and ui grid refresh
  function upload(evt) {
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
      const convertedData = convertData(parsedData)
      $scope.grid.data = convertedData
      assignColumnDefs(convertedData[0])
      $scope.$apply()
    } // end onLoad
    reader.onerror = function() {
      console.log('error reading file')
    }
  }

  /**
   * given row of dataset as strings, determine
   * if any data are actually numbers or booleans
   * @param  {Object} row - first row of dataset as object of strings
   * @return {Array} - array of objects [header: <header>, type: 'string' | 'boolean' | 'number']
   */
  function determineVarTypes(row) {
    let types = []
    for(header in row) {
      type = 'string'
      const datum = row[header]
      if(datum === "true" || datum === "false") type = 'boolean'
      if(!isNaN(datum)) type = 'number'
      types.push({header, type})
    }
    return types
  }

  /**
   * takes data in string format and attempts to
   * convert numbers and booleans to their appropriate values
   * @param  {Array} rows - Array of objects of strings
   * @return {Array} - Array of objects of mixed
   */
  function convertData(rows) {
    let types = determineVarTypes(rows[0])
    for(let i = 0; i < rows.length; i++) {
      for(let j = 0; j < types.length; j++) {
        let typeObj = types[j]
        let header = typeObj.header; let type = typeObj.type
        if(type === 'number') rows[i][header] = Number(rows[i][header])
        if(type.type === 'boolean') {
          if (rows[i][header] === "true") rows[i][header] = true
          if (rows[i][header] === "false") rows[i][header] = false
        }
      }
    }
    return rows
  }

  function assignColumnDefs(row) {
    $scope.grid.columnDefs = []
    for(header in row) {
      let columnDef = {}

      if(typeof row[header] === "number") {
        columnDef = {
          field: header,
          minWidth: 100,
          filters: [{
              condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
              placeholder: '>='
            },{
              condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
              placeholder: '<='
            }
          ]
        }
      } else if(typeof row[header] === "string") {
        columnDef = {
          field: header,
          minWidth: 100
        }
      }

      $scope.grid.columnDefs.push(columnDef)
    } // end for in loop
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
    console.log($scope.chartSource)

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











