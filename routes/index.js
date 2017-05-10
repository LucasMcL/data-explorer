'use strict'

const { Router } = require('express')
const router = Router()

router.get('/', (req, res, next) => {
	res.status(200).json({})
})
router.use(require('./datasetsRt'))

module.exports = router;
