var mongoose = require('mongoose');

var expenditureSchema = new mongoose.Schema({
  _expenditureId  : mongoose.Schema.ObjectId,
  desc            : String,
  category        : { type: String, index: true },
  amount          : { type: Number, index: true },
  date            : { type: Date, index: true, default: Date.now }
});

module.exports.model = mongoose.model('Expenditure', expenditureSchema);

module.exports.categories = [
  'Clothes',
  'Food',
  'Transportation',
  'Housing',
  'Necessity',
  'Utility',
  'Other'
];
