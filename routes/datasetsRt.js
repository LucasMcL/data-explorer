'use strict'

const { Router } = require('express')
const router = Router()

const {getDatasets, getDataset, addDataset, deleteDataset} = require('../controllers/datasetCtrl')

// TODO: activate data conversion middleware if necessary
// router.use('/datasets', dataConversion)
router.get('/datasets', getDatasets)
router.get('/datasets/:datasetid', getDataset)
router.post('/datasets', addDataset)
router.delete('/datasets/:datasetid', deleteDataset)

function dataConversion(req, res, next) {
	console.log(req.body)
	if(req.body.data) {
		console.log('request object has data property')
		req.body.data = JSON.stringify(req.body.data)
		console.log(req.body)
		next()
	}
	next()
}

module.exports = router
