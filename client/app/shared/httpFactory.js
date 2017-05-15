app.factory('HttpFact', function($http) {
	console.log('http factory instantiated')

	function getAllDatasets() {
		return $http.get('http://localhost:9000/api/datasets')
			.then(response => response.data)
			.catch(err => err)
	}

	// Expects object like
	// {name: "Store performance", size: 200, file_type: "text/csv", user_id: 1,
	// data: JSON.stringify([{label: "Bakersfield Central",value: "880000"},{label: "Garden Groove harbour",value: "730000"}])},

	function addDataset(postBody) {
		return $http.post('http://localhost:9000/api/datasets', postBody)
	}

	return { getAllDatasets, addDataset }
})
