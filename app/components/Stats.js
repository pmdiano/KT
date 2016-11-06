import React from 'react';
import StatsStore from '../stores/StatsStore';
import StatsActions from '../actions/StatsActions';

class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = StatsStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    StatsStore.listen(this.onChange);
    StatsActions.getStats(this.props.params.type);
  }

  componentWillUnmount() {
    StatsStore.unlisten(this.onChange);
  }

  componentDidUpdate(prevProps) {
    // Fetch new stats data when URL path changes
    if (prevProps.params.type !== this.props.params.type) {
      StatsActions.getStats(this.props.params.type);
    }
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className='container'>
        <p>days = {this.state.numOfDays}</p>
        <p>clothes = {this.state.totalStats.clothes}</p>
        <p>food = {this.state.totalStats.food}</p>
        <p>transportation = {this.state.totalStats.transportation}</p>
        <p>housing = {this.state.totalStats.housing}</p>
        <p>utitily = {this.state.totalStats.utility}</p>
        <p>other = {this.state.totalStats.other}</p>
      </div>
    );
  }
}

export default Stats;
