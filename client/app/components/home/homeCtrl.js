app.controller('HomeCtrl', function($scope, uiGridConstants) {
  console.log('Home control instantiated')

  // Read file on file input event
  $('#file-input').change(upload)

  $scope.grid = {
    columnDefs: [],
    data: [],
    enableHorizontalScrollbar: 2
    // onRegisterApi: function(gridApi) {
    //   $scope.gridApi = gridApi
    // }
  }

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
        csvData = `"row",` + csvData.slice(3)
      }
      const parsedData = $.csv.toObjects(csvData)
      $scope.grid.data = parsedData
      const varNames = Object.keys(parsedData[0])
      $scope.grid.columnDefs = []
      varNames.forEach(name => $scope.grid.columnDefs.push({field: name, minWidth: 100}))
      $scope.$apply()
      // $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.ALL )
    }
    reader.onerror = function() {
      console.log('error reading file')
    }
  }


})





















  // const stringData = JSON.stringify(dataAsObjects)
  // $.ajax({
  //   type: "POST",
  //   url: 'http://localhost:5555/files',
  //   data: reqBody,
  //   success: () => console.log('success')
  // });

  // let reqBody = {
  //   name: file.name,
  //   size: file.size,
  //   type: file.type,
  //   file: csvData
  // }

  // $scope.grid = {
  //   data: [
  //     {
  //         "firstName": "Cox",
  //         "lastName": "Carney",
  //         "company": "Enormo",
  //         "employed": true
  //     },
  //     {
  //         "firstName": "Lorraine",
  //         "lastName": "Wise",
  //         "company": "Comveyer",
  //         "employed": false
  //     },
  //     {
  //         "firstName": "Nancy",
  //         "lastName": "Waters",
  //         "company": "Fuelton",
  //         "employed": false
  //     }
  //   ]
  // }
