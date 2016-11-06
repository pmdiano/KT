var exp = require('../models/expenditure');
var categories = exp.categories;

var DAYS = 30;
var WEEKS = 12;
var MONTHS = 12;
var YEARS = 5;

Date.prototype.normalizeDay = function() {
  this.setHours(0);
  this.setMinutes(0);
  this.setSeconds(0);
  return this;
}

Date.prototype.normalizeWeek = function() {
  this.normalizeDay();
  this.setDate(this.getDate() - this.getDay());
  return this;
}

Date.prototype.normalizeMonth = function() {
  this.normalizeDay();
  this.setDate(1);
  return this;
}

Date.prototype.normalizeYear = function() {
  this.normalizeMonth();
  this.setMonth(0);
  return this;
}

Date.prototype.incrementDay = function() {
  this.setDate(this.getDate() + 1);
}

Date.prototype.incrementWeek = function() {
  this.setDate(this.getDate() + 7);
}

Date.prototype.incrementMonth = function() {
  this.setMonth(this.getMonth() + 1);
}

Date.prototype.incrementYear = function() {
  this.setFullYear(this.getFullYear() + 1);
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
}

function Stats() {
  this.clothes = 0;
  this.food = 0;
  this.transportation = 0;
  this.housing = 0;
  this.utility = 0;
  this.other = 0;
}

Stats.prototype = {
  constructor: Stats,
  addExpenditure: function(record) {
    if (categories.indexOf(record.category) === -1 || typeof record.amount !== 'number') {
      console.info("Invalid expenditure record:");
      console.dir(record);
      return;
    }

    switch (record.category) {
      case 'Clothes': this.clothes += record.amount; break;
      case 'Food': this.food += record.amount; break;
      case 'Transportation': this.transportation += record.amount; break;
      case 'Housing': this.housing += record.amount; break;
      case 'Utility': this.utility += record.amount; break;
      case 'Other': this.other += record.amount; break;
    }
  }
}

exports = module.exports = {};

// TODO: write some tests for this
exports.getTimeToQuery = function(type) {
  var time = new Date();

  switch (type) {
    case 'daily':
      // Last 30 days including today
      time.normalizeDay();
      time.setDate(time.getDate() - (DAYS - 1));
      break;

    case 'weekly':
      // Last 12 weeks including this week, starting from Sunday
      time.normalizeWeek();
      time.setDate(time.getDate() - (WEEKS - 1) * 7);
      break;

    case 'monthly':
      // Last 12 months
      time.normalizeMonth();
      time.setMonth(time.getMonth() - (MONTHS - 1));
      break;

    case 'yearly':
      // Last 5 years
      time.normalizeYear();
      time.setFullYear(time.getFullYear() - (YEARS - 1));
      break;
  }

  return time;
}

exports.getStats = function(expenditures, type) {
  if (type != 'daily' && type != 'weekly' && type != 'monthly' && type != 'yearly') {
    return null;
  }

  var stats = [],
      dates = [],
      last = new Date(),
      len = 0,
      normalizeFn = null,
      incrementFn = null;      

  switch (type) {
    case 'daily':
      normalizeFn = Date.prototype.normalizeDay;
      incrementFn = Date.prototype.incrementDay;
      last.normalizeDay();
      last.setDate(last.getDate() - DAYS);
      len = DAYS;
      break;

    case 'weekly':
      normalizeFn = Date.prototype.normalizeWeek;
      incrementFn = Date.prototype.incrementWeek;
      last.normalizeWeek();
      last.setDate(last.getDate() - WEEKS * 7);
      len = WEEKS;
      break;

    case 'monthly':
      normalizeFn = Date.prototype.normalizeMonth;
      incrementFn = Date.prototype.incrementMonth;
      last.normalizeMonth();
      last.setMonth(last.getMonth() - MONTHS);
      len = MONTHS;
      break;

    case 'yearly':
      normalizeFn = Date.prototype.normalizeYear;
      incrementFn = Date.prototype.incrementYear;
      last.normalizeYear();
      last.setFullYear(last.getFullYear() - YEARS);
      len = YEARS;
      break;
  }

  expenditures.forEach(function(e) {
    var day = normalizeFn.call(e.date);
    while (!isSameDay(day, last)) {
      incrementFn.call(last);
      dates.push(new Date(last.getFullYear(), last.getMonth(), last.getDate()));
      stats.push(new Stats());
    }
    stats[stats.length - 1].addExpenditure(e);
  });

  // If we don't have recent data (e.g., there is no item for today),
  // we need to append empty stats
  while (dates.length < len) {
    incrementFn.call(last);
    dates.push(new Date(last.getFullYear(), last.getMonth(), last.getDate()));
    stats.push(new Stats());
  }

  console.log("type = " + type + ", dates.len = " + dates.length + ", stats.len = " + stats.length);

  return {
    dates: dates,
    stats: stats
  }
}
