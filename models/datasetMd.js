const {bookshelf} = require('../db/config')
require('./userMd')
require('./graphMd')

const Dataset = bookshelf.Model.extend({
	tableName: 'datasets',
	user: function() { return this.belongsTo('User') },
	graphs: function() { return this.hasMany('Graph') }
}, {
	dependents: ['graphs'],
	getAll: function() {
		return this.forge().fetchAll()
	},
	getAllForUser: function(user_id) {
		return this.forge().where({user_id}).fetchAll()
	},
	getOneById: function(datasetId) {
		return this.forge().where({id: datasetId}).fetch()
	}
})

module.exports = bookshelf.model('Dataset', Dataset)
