import alt from '../alt';
import {assign} from 'underscore';

class NavbarActions {
  constructor() {
    this.generateActions(
      'updateOnlineUsers',
      'updateAjaxAnimation',
      'updateSearchQuery',
      'findExpenditureSuccess',
      'findExpendigureFail'
    );
  }

  findExpenditure(payload) {
    $.ajax({
      url: '/api/expenditure/search',
      data: { name: payload.searchQuery }
    })
      .done((data) => {
        assign(payload, data);
        this.actions.findExpenditureSuccess(payload);
      })
      .fail(() => {
        this.actions.findExpendigureFail(payload);
      });
  }
}

export default alt.createActions(NavbarActions);
