const datasets = require('./datasets')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('datasets').del()
    .then(function () {
      // Inserts seed entries
      return knex('datasets').insert([
        {name: "C02", user_id: 1, data: JSON.stringify(datasets.c02)},
        {name: "Cars", user_id: 1, data: JSON.stringify(datasets.cars)},
        {name: "Motor Trend Cars", user_id: 1, data: JSON.stringify(datasets.mtcars)}
      ]);
    });
};
