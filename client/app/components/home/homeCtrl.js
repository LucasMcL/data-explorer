app.controller('HomeCtrl', function($scope, uiGridConstants) {
  console.log('Home control instantiated')

  // Read file on file input event
  $('#file-input').change(upload)

  $scope.grid = {
    columnDefs: [],
    data: [],
    enableHorizontalScrollbar: 2
  }

  // save dataset variables here
  $scope.vars = []

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
      $scope.grid.columnDefs = []; $scope.vars = []
      for(header in convertedData[0]) {
        $scope.grid.columnDefs.push({field: header, minWidth: 100})
        $scope.vars.push(header)
      }
      $scope.$apply()
    }
    reader.onerror = function() {
      console.log('error reading file')
    }
  }

  $scope.sayHello = function(chartType) {
    console.log('hello, ' + chartType)
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

})











