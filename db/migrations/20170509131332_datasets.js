exports.up = function(knex, Promise) {
	return knex.schema.createTable('datasets', table => {
		table.increments()
		table.text('data', 'longtext').notNullable()
		table.string('name').notNullable()
		table.string('description')
		table.string('file_type')
		table.string('size')

		table.integer('user_id').unsigned().references('users.id')
	})
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('datasets')
};
