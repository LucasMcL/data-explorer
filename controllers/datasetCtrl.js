'use strict'

const Dataset = require('../models/datasetMd')

// Accepts query of userid={userid}
// If user id is in query, return datasets for that user
// Else, return all datasets
module.exports.getDatasets = (req, res, next) => {
	const userid = req.query.userid

	if(userid) {
		Dataset.getAllForUser(userid)
			.then(models => {
				let datasets = models.toJSON()
				// convert actual data from stringified json to object literal
				datasets.forEach(dataset => {dataset.data = JSON.parse(dataset.data)})
				res.status(200).json({datasets})
			})
			.catch(error => next(error))
	} else {
		Dataset.getAll()
			.then(models => {
				let datasets = models.toJSON()
				// convert actual data from stringified json to object literal
				datasets.forEach(dataset => {dataset.data = JSON.parse(dataset.data)})
				res.status(200).json({datasets})
			})
			.catch(error => next(error))
	}
}

// Returns a single dataset with given id
module.exports.getDataset = (req, res, next) => {
	const datasetId = req.params.datasetid

	// Expects single object
	Dataset.getOneById(datasetId)
		.then(model => {
			let dataset = model.toJSON()
			dataset.data = JSON.parse(dataset.data)
			res.status(200).json({dataset})
		})
		.catch(error => next(error))
}

// Returns json object containing id of just added dataset
module.exports.addDataset = (req, res, next) => {
	const dataset = req.body
	// console.log('dataset', dataset)

	Dataset.forge(dataset).save({}, {require: true})
		.then(model => {res.status(200).json({id: model.get('id')})})
		.catch(error => {next(error)})
}

module.exports.deleteDataset = (req, res, next) => {
	const datasetid = req.params.datasetid

	Dataset.forge({id: datasetid}).destroy({require: true})
		.then(model => res.status(200).json({}))
		.catch(error => next(error))
}
















