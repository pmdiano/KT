var stats = require('./stats');
var exp = require('../models/expenditure');
var Q = require('q');
var Expenditure = exp.model;

/**
 * GET /api/expenditures
 * Returns recent 50 expenditures
 */
exports.getExpenditures = function (req, res, next) {
  Expenditure.find().
    where('category').nin(['Housing', 'Utility']).
    sort( { date: -1 } ).
    limit(50).
    exec(function(err, expenditures) {
      if (err) return next(err);
      res.send(expenditures);
    });
}

/**
 * GET /api/stats
 * Returns the statistics of expenditure depending on the query
 */
exports.getStats = function(req, res, next) {
  try {
    var type = req.query.type,
        since = stats.getTimeToQuery(type);

    Expenditure.find( { date: {$gt: since} })
      .exec(function(err, expenditures) {
        if (err) return next(err);
        res.send(stats.getStats(expenditures, type));
      });
  } catch (e) {
    res.status(500).send({ message: e });
  }
}

/**
 * POST /api/expenditure
 * Adds new expenditure item to the database.
 */
exports.postExpenditure = function(req, res, next) {
  try {
    var desc = req.body.desc;
    var category = req.body.category;
    var amount = Number(req.body.amount).round2();
    var spread = req.body.spread;
    var time = new Date();

    if (spread == "false") {
      var expenditure = new Expenditure({
        desc: desc,
        category: category,
        amount: amount,
        date: time
      });

      expenditure.save(function(err) {
        if (err) return next(err);
        res.send({ message: 'Expenditure has been added successfully!' });
      });

    } else {
      time.normalizeMonth();
      var days = new Date(time.getFullYear(), time.getMonth()+1, 0).getDate();
      var avgAmount = (amount / days).round2();
      var dayOneAmount = (amount - avgAmount * (days - 1)).round2();
      var promises = [];

      for (var day = 1; day <= days; day++) {
        let expenditure = new Expenditure({
          desc: desc,
          category: category,
          amount: day == days ? dayOneAmount : avgAmount,
          date: new Date(time)
        })

        promises.push(Q(expenditure.save()));
        time.incrementDay();
      }

      Q.all(promises)
        .then(function() {
          return res.send({ message: 'Spreading expenditure has been added successfully!' });
        }, function (err) {
          return next(err);
        });
    }

  } catch (e) {
    res.status(500).send({ message: e });
  }
}
