import alt from '../alt';
import HomeActions from '../actions/HomeActions';

class HomeStore {
  constructor() {
    this.bindActions(HomeActions);
    this.expenditures = [];
  }

  onGetExpendituresSuccess(data) {
    this.expenditures = data;
  }

  onGetExpendituresFail(errorMessage) {
    toastr.error(errorMessage);
  }
}

export default alt.createStore(HomeStore);
