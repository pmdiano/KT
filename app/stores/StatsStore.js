import {assign} from 'underscore';
import alt from '../alt';
import StatsActions from '../actions/StatsActions';

/**
 * dates: Array[30]
 * numOfDays: 30
 * stats: Array[30]
 * totalStats: Object__proto__: Object
 */
class StatsStore {
  constructor() {
    this.bindActions(StatsActions);
    this.dates = [];
    this.statsSeries = [];
    this.totalStats = {};
    this.avgSpending = null;
  }

  onGetStatsSuccess(data) {
    assign(this, data);
  }

  onGetStatsFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(StatsStore);
