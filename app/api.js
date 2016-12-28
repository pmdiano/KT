var stats = require('./stats');
var exp = require('../models/expenditure');
var Expenditure = exp.model;

/**
 * GET /api/expenditures
 * Returns recent 50 expenditures
 */
exports.getExpenditures = function (req, res, next) {
  Expenditure.find().sort( { date: -1 } ).limit(50)
    .exec(function(err, expenditures) {
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
    var amount = req.body.amount;
    var time = new Date();

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
  } catch (e) {
    res.status(500).send({ message: e });
  }
}
