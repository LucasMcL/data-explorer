exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {email: 'testuser@example.com', hash: 'abc123'},
        {email: 'testuser2@example.com', hash: 'def456'}
      ]);
    });
};
