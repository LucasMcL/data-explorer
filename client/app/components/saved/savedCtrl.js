app.controller('SavedCtrl', function($scope, datasets) {
	console.log('Saved control instantiated')

	$scope.datasets = datasets

	// Trims datasets to 10 rows with first 3 vars
	datasets.forEach(dataset => {
		dataset.data = {data: dataset.data.slice(0, 10)}
		for(let i = 0; i < 10; i++) {
			let row = dataset.data.data[i]
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
