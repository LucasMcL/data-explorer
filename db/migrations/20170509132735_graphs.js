exports.up = function(knex, Promise) {
	return knex.schema.createTable('graphs', table => {
		table.increments()
		table.text('source', 'longtext').notNullable()
		table.string('type').notNullable()

		table.integer('dataset_id').notNullable().unsigned().references('datasets.id')
	})
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('graphs')
};
