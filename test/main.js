var mongoose = require('mongoose'),
    crypto = require('crypto'),
    config = require('../config'),
    exp = require('../models/expenditure'),
    categories = exp.categories,
    Expenditure = exp.model,
    days = 2000,
    records_per_day = 5,
    total = 0;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function populate() {
  Expenditure.remove({}, function(err) {
    console.log('Collection cleared');
    console.log('Inserting records for ' + days + ' days');
    for (var d = 0; d < days; d++) {
      var time = new Date();
      time.setDate(time.getDate() - d);

      for (var r = 0; r < records_per_day; r++) {
        var desc = crypto.randomBytes(10).toString('hex'),
            category = categories[getRandomInt(0, categories.length)],
            amount = getRandomInt(1, 5000) / 100;

        var expenditure = new Expenditure({
          desc: desc,
          category: category,
          amount: amount,
          date: time
        });

        expenditure.save(function(err) {
          if (err) {
            console.error('Save failure:');
            console.dir(expenditure);
          }
          total++;
          if (total == days * records_per_day) {
            mongoose.connection.close();
          }
        });
      }
    }
  });
}

function test() {
  populate();
}

/**
 * Connect to Mongo
 */
mongoose.connect(config.database);
mongoose.connection.on('error', function(err) {
  console.info('Could not connect to MongoDB. Did you forget run `mongod`? Error: ' + err);
});
mongoose.connection.on('connected', function() {
  console.info('Mongoose connection open to ' + config.database);
  test();
});
mongoose.connection.on('disconnected', function() {
  console.info('Mongoose connection disconnected, total records saved = ' + total);
});
