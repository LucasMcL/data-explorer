const {bookshelf} = require('../db/config')
require('./datasetMd')

const User = bookshelf.Model.extend({
	tableName: 'users',
	datasets: function() { return this.hasMany('Dataset') }
}, {
	dependents: ['datasets'],
})

module.exports = bookshelf.model('User', User)
