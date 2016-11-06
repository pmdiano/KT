import alt from '../alt';

class StatsActions {
  constructor() {
    this.generateActions(
      'getStatsSuccess',
      'getStatsFail'
    );
  }

  getStats(type) {
    $.ajax({ url: '/api/stats?type=' + type})
      .done((data) => {
        this.actions.getStatsSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getStatsFail(jqXhr);
      });
  }
}

export default alt.createActions(StatsActions);
