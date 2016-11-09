var dateFormat = require('dateformat');
var exp = require('../models/expenditure');
var categories = exp.categories;

'use strict';

var DAYS = 30;
var WEEKS = 12;
var MONTHS = 12;
var YEARS = 5;
var _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
}

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

Number.prototype.round2 = function() {
  return Math.round(this * 100) / 100;
}

function Stats() {
  this.Clothes = 0;
  this.Food = 0;
  this.Transportation = 0;
  this.Housing = 0;
  this.Utility = 0;
  this.Other = 0;
}

Stats.prototype = {
  constructor: Stats,
  addExpenditure: function(record) {
    if (categories.indexOf(record.category) === -1 || typeof record.amount !== 'number') {
      console.info("Invalid expenditure record:");
      console.dir(record);
      return;
    }
    this[record.category] += record.amount;
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
      normalize = null,
      increment = null,
      format = null;

  var uncurry = function(param) {
    return function(time) {
      return dateFormat(time, param);
    };
  };

  switch (type) {
    case 'daily':
      normalize = Date.prototype.normalizeDay;
      increment = Date.prototype.incrementDay;
      format = uncurry("m-d");
      last.normalizeDay();
      last.setDate(last.getDate() - DAYS);
      len = DAYS;
      break;

    case 'weekly':
      normalize = Date.prototype.normalizeWeek;
      increment = Date.prototype.incrementWeek;
      format = uncurry("mmm d");
      last.normalizeWeek();
      last.setDate(last.getDate() - WEEKS * 7);
      len = WEEKS;
      break;

    case 'monthly':
      normalize = Date.prototype.normalizeMonth;
      increment = Date.prototype.incrementMonth;
      format = uncurry("mmm yyyy");
      last.normalizeMonth();
      last.setMonth(last.getMonth() - MONTHS);
      len = MONTHS;
      break;

    case 'yearly':
      normalize = Date.prototype.normalizeYear;
      increment = Date.prototype.incrementYear;
      format = uncurry("yyyy");
      last.normalizeYear();
      last.setFullYear(last.getFullYear() - YEARS);
      len = YEARS;
      break;
  }

  expenditures.forEach(function(e) {
    var day = normalize.call(e.date);
    while (!isSameDay(day, last)) {
      increment.call(last);
      dates.push(format(last));
      stats.push(new Stats());
    }
    stats[stats.length - 1].addExpenditure(e);
  });

  // If we don't have recent data (e.g., there is no item for today),
  // we need to append empty stats
  while (dates.length < len) {
    increment.call(last);
    dates.push(format(last));
    stats.push(new Stats());
  }

  /**
   * The stats series to plot the stack bar graph
   */
  var statsSeries = categories.map(function(category) {
    return {
      name: category,
      data: stats.map(x => x[category].round2())
    };
  });

  /**
   * Stats to show the average spending per day in different category
   */
  var numOfDays = 1 + dateDiffInDays(exports.getTimeToQuery(type), new Date()),
      total = new Stats(),
      totalSpending = 0,
      totalStats = null;

  stats.forEach(function(stat) {
    categories.forEach(function(category) {
      total[category] += stat[category];
    });
  });

  totalStats = categories.map(function(category) {
    return {
      name: category,
      value: total[category].round2()
    }
  }),

  totalSpending = categories.reduce((t, category) => {
    return t + total[category];
  }, 0);

  return {
    dates: dates,
    statsSeries: statsSeries,
    totalStats: totalStats,
    avgSpending: (totalSpending / numOfDays).round2()
  }
}
