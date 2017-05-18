app.factory('HttpFact', function($http) {
	console.log('http factory instantiated')

	function getAllDatasets() {
		return $http.get('http://localhost:9000/api/datasets')
			.then(response => response.data.datasets)
			.catch(err => err)
	}

	// Expects object like
	// {name: "Store performance", size: 200, file_type: "text/csv", user_id: 1,
	// data: JSON.stringify([{label: "Bakersfield Central",value: "880000"},{label: "Garden Groove harbour",value: "730000"}])},

	function addDataset(postBody) {
		return $http.post('http://localhost:9000/api/datasets', postBody)
	}

	function deleteDataset(id) {
		return $http.delete(`http://localhost:9000/api/datasets/${id}`)
	}

	function getDataset(id) {
		console.log('getDataset')
		return $http.get(`http://localhost:9000/api/datasets/${id}`)
	}

	return { getAllDatasets, addDataset, deleteDataset, getDataset }
})
