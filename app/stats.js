exports = module.exports = {};

// TODO: write some tests for this
exports.getTimeToQuery = function(type) {
  var time = new Date();
  time.setHours(0);
  time.setMinutes(0);
  time.setSeconds(0);

  switch (type) {
    case 'daily':
      time.setDate(time.getDate() - 29);
      break;

    case 'weekly':
      // Total 12 weeks starting from Sunday
      time.setDate(time.getDate() - time.getDay());
      time.setDate(time.getDate() - 11 * 7);
      break;

    case 'monthly':
      // Last 12 months
      time.setDate(1);
      time.setMonth(time.getMonth() - 11);
      break;

    case 'yearly':
      // Last 5 years
      time.setDate(1);
      time.setMonth(0);
      time.setFullYear(time.getFullYear() - 4);
      break;
  }

  return time;
}
