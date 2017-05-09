const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile.js')[environment];
const knex = require('knex')(config);
const bookshelf = require('bookshelf')(knex);
const cascadeDelete = require('bookshelf-cascade-delete');

bookshelf.plugin('registry');

// Enable cascading delete
// Disable like this: Author.forge({ id: 1 }).destroy({ cascadeDelete: false });
// https://github.com/seegno/bookshelf-cascade-delete
bookshelf.plugin(cascadeDelete);

module.exports = {knex, bookshelf}
