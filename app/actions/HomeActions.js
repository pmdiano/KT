import alt from '../alt';

class HomeActions {
  constructor() {
    this.generateActions(
      'getExpendituresSuccess',
      'getExpendituresFail'
    );
  }

  getExpenditures() {
    $.ajax({ url: '/api/expenditures' })
      .done(data => {
        this.actions.getExpendituresSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.getExpendituresFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(HomeActions);
