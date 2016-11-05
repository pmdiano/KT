import React from 'react';
import {Link} from 'react-router';
import HomeStore from '../stores/HomeStore';
import HomeActions from '../actions/HomeActions';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = HomeStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    HomeStore.listen(this.onChange);
    HomeActions.getExpenditures();
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    var expenditureRows = this.state.expenditures.map((expenditure, index) => {
      return (
        <tr key={expenditure._id}>
          <th scope='row' key={expenditure._id+'col1'}>{index+1}</th>
          <td key={expenditure._id+'col2'}>{expenditure.date}</td>
          <td key={expenditure._id+'col3'}>{expenditure.desc}</td>
          <td key={expenditure._id+'col4'}>{expenditure.category}</td>
          <td key={expenditure._id+'col5'}>{expenditure.amount}</td>
        </tr>
      );
    });

    return (
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <h3 className='text-center'>Recent Expenditures</h3>
            <table className='table table-hover'>
              <thread className='thead-inverse'>
                <tr>
                  <th key='col1'>#</th>
                  <th key='col2'>Date</th>
                  <th key='col3'>Description</th>
                  <th key='col4'>Category</th>
                  <th key='col5'>Amount</th>
                </tr>
              </thread>
              <tbody>
                {expenditureRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;
