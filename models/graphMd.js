const {bookshelf} = require('../db/config')
require('./datasetMd')

const Graph = bookshelf.Model.extend({
	tableName: 'graphs',
	dataset: function() { return this.belongsTo('Dataset') }
})

module.exports = bookshelf.model('Graph', Graph)
