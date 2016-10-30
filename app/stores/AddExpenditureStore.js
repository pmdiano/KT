import alt from '../alt';
import AddExpenditureActions from '../actions/AddExpenditureActions';

class AddExpenditureStore {
  constructor() {
    this.bindActions(AddExpenditureActions);
    this.desc = '';
    this.category = '';
    this.amount = 0;
    this.descHelpBlock = '';
    this.categoryHelpBlock = '';
    this.descValidationState = '';
    this.categoryValidationState = '';
    this.amountValidationState = '';
    this.responseHelpBlock = '';
  }

  onAddExpenditureSuccess(successMessage) {
    this.descValidationState = 'has-success';
    this.categoryValidationState = 'has-success';
    this.amountValidationState = 'has-success';
    this.responseHelpBlock = successMessage;
  }

  onAddExpenditureFail(errorMessage) {
    this.descValidationState = 'has-error';
    this.responseHelpBlock = errorMessage;
  }

  onUpdateDesc(event) {
    this.desc = event.target.value;
    this.descValidationState = '';
    this.descHelpBlock = '';
  }

  onUpdateCategory(event) {
    this.category = event.target.value;
    this.categoryValidationState = '';
    this.categoryHelpBlock = '';
  }

  onUpdateAmount(event) {
    this.amount = event.target.value;
    this.amountValidationState = '';
  }

  onInvalidDesc() {
    this.descValidationState = 'has-error';
    this.descHelpBlock = 'Please enter a description.';
  }

  onInvalidCategory() {
    this.categoryValidationState = 'has-error';
    this.categoryHelpBlock = 'Please select a category.';
  }

  onInvalidAmount() {
    this.amountValidationState = 'has-error';
  }
}

export default alt.createStore(AddExpenditureStore);
