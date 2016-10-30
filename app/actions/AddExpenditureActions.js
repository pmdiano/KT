import alt from '../alt';

class AddExpenditureActions {
  constructor() {
    this.generateActions(
      'addExpenditureSuccess',
      'addExpenditureFail',
      'updateDesc',
      'updateCategory',
      'updateAmount',
      'invalidDesc',
      'invalidCategory',
      'invalidAmount',
      'clearHelpBlock'
    );
  }

  addExpenditure(desc, category, amount) {
    $.ajax({
      type: 'POST',
      url: '/api/expenditures',
      data: { desc: desc, category: category, amount: amount }
    })
      .done((data) => {
        this.actions.addExpenditureSuccess(data.message);
      })
      .fail((jqXhr) => {
        this.actions.addExpenditureFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(AddExpenditureActions);
