// TODO: remove varNames array
// Update input options with columnDefs.field

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
    chart: {},
    data: []
  }

  // save selected chartType here
  $scope.chartType

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
              condition: uiGridConstants.filter.GREATER_THAN,
              placeholder: '>='
            },{
              condition: uiGridConstants.filter.LESS_THAN,
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

  // TODO: check for if labels exist or not
  $scope.updateLabels = function(labels) {
    if(!labels) return
    const allData = $scope.grid.data
    if($scope.chartSource.data.length === 0) {
      allData.forEach(datum => $scope.chartSource.data.push({label: String(datum[labels])}))
    }
    console.log($scope.chartSource.data)
  }

  $scope.updateValues = function(values) {
    if(!values) return
    const allData = $scope.grid.data

    allData.forEach((datum, i) => {
      $scope.chartSource.data[i].value = datum[values]
    })
  }

  $scope.logVisibleRows = function() {
    console.log($scope.gridApi.core.getVisibleRows())
  }

})











