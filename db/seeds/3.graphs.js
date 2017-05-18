const data = {
    chart: {
        caption: "Harry's SuperMart",
        subCaption: "Top 5 stores in last month by revenue",
        exportEnabled: 1,

    },
    data: [
        {
            label: "Bakersfield Central",
            value: "880000"
        },
        {
            label: "Garden Groove harbour",
            value: "730000"
        },
        {
            label: "Los Angeles Topanga",
            value: "590000"
        },
        {
            label: "Compton-Rancho Dom",
            value: "520000"
        },
        {
            label: "Daly City Serramonte",
            value: "330000"
        }
    ]
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('graphs').del()
    .then(function () {
      // Inserts seed entries
      return knex('graphs').insert([
        {type: 'column2d', dataset_id: 1, source: JSON.stringify(data)},
        {type: 'pie2d', dataset_id: 1, source: JSON.stringify(data)}
      ]);
    });
};
