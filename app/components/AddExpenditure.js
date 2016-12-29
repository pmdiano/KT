import React from 'react';
import AddExpenditureStore from '../stores/AddExpenditureStore';
import AddExpenditureActions from '../actions/AddExpenditureActions';

class AddExpenditure extends React.Component {
  constructor(props) {
    super(props);
    this.state = AddExpenditureStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    AddExpenditureStore.listen(this.onChange);
  }

  componentWillUnmount() {
    AddExpenditureStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();

    var desc = this.state.desc.trim();
    var category = this.state.category;
    var amount = this.state.amount;
    var spread = this.state.spread;

    if (!desc) {
      AddExpenditureActions.invalidDesc();
      this.refs.descTextField.getDOMNode().focus();
    }

    if (!category) {
      AddExpenditureActions.invalidCategory();
    }

    if (desc && category) {
      AddExpenditureActions.addExpenditure(desc, category, amount, spread);
    }
  }

  render() {
    return (
      <div className='container'>
        <div className='row flipInX animated'>
          <div className='col-sm-8'>
            <div className='panel panel-default'>
              <div className='panel-heading'>Add Expenditure</div>
              <div className='panel-body'>
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <div className={'form-group ' + this.state.descValidationState}>
                    <label className='control-label'>Description</label>
                    <input type='text'
                           className='form-control'
                           ref='descTextField'
                           value={this.state.desc}
                           onChange={AddExpenditureActions.updateDesc}
                           autoFocus/>
                    <span className='help-block'>{this.state.descHelpBlock}</span>
                  </div>
                  <div className={'form-group ' + this.state.categoryValidationState}>
                    <label className='control-label'>Category</label>
                    <select className="form-control"
                            value={this.state.category}
                            onChange={AddExpenditureActions.updateCategory}>
                      <option>Clothes</option>
                      <option>Food</option>
                      <option>Transportation</option>
                      <option>Housing</option>
                      <option>Necessity</option>
                      <option>Utility</option>
                      <option>Other</option>
                      <option></option>
                    </select>
                    <span className='help-block'>{this.state.categoryHelpBlock}</span>
                  </div>
                  <div className={'form-group ' + this.state.amountValidationState}>
                    <label className='control-label'>Amount</label>
                    <input type='number'
                           step="0.01"
                           className='form-control'
                           value={this.state.amount}
                           onChange={AddExpenditureActions.updateAmount}/>
                  </div>
                  <div className='form-group'>
                    <label className='control-lable'>Spread over the month</label>
                    <input type='checkbox'
                         className='form-control'
                         value={this.state.spread}
                         onChange={AddExpenditureActions.updateSpread}/>
                  </div>
                  <button type='submit' className='btn btn-primary'>Submit</button>
                </form>
                <span className='help-block'>{this.state.responseHelpBlock}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddExpenditure;
