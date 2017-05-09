const {bookshelf} = require('../db/config')
require('./userMd')
require('./graphMd')

const Dataset = bookshelf.Model.extend({
	tableName: 'datasets',
	user: function() { return this.belongsTo('User') },
	graphs: function() { return this.hasMany('Graph') }
}, {
	dependents: ['graphs'],
})

module.exports = bookshelf.model('Dataset', Dataset)
