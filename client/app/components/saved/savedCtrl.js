app.controller('SavedCtrl', function($scope, datasets, uiGridConstants) {
	console.log('Saved control instantiated')

	$scope.datasets = datasets

	// Trims datasets to 10 rows with first 3 vars
	datasets.forEach(dataset => {
		dataset.grid = {data: dataset.data.slice(0, 10)}
		dataset.grid.enableSorting = false
		dataset.grid.enableColumnMenus = false
		dataset.grid.enableVerticalScrollbar = uiGridConstants.scrollbars.NEVER
		for(let i = 0; i < 10; i++) {
			let row = dataset.grid.data[i]
			let j = 0
			for(header in row) {
				if(j <= 2) {j++; continue}
				else delete row[header]
				j++
			}
		}
	})

	$scope.trimmedDatasets = datasets
	console.log('$scope.trimmedDatasets', $scope.trimmedDatasets)

})
