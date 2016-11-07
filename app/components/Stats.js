import React from 'react';
import ReactEcharts from 'echarts-for-react';
import StatsStore from '../stores/StatsStore';
import StatsActions from '../actions/StatsActions';

var categories = [
  'Clothes',
  'Food',
  'Transportation',
  'Housing',
  'Utility',
  'Other'
];

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
    this.updatePieChart();
  }

  updatePieChart() {
    var startDate = new Date(Date.parse(this.state.dates[0]));
    var echartsPieInstance = this.refs.echarts_pie.getEchartsInstance();

    echartsPieInstance.setOption({
      title: {
        text: 'Daily average spending: ' + this.state.avgSpending,
        subtext: startDate.toDateString() + ' - today'
      },
      legend: {
        data: categories
      },
      series: [{
        name: 'Spending',
        data: this.state.totalStats
      }]
    });
  }

  getPieOption() {
    var option = {
      title : {
        text: 'Daily average spending: ',
        subtext: '',
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: []
      },
      series : [{
        name: 'Spending',
        type: 'pie',
        radius : '55%',
        center: ['50%', '60%'],
        data:[],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };

    return option;
  }

  render() {
    return (
      <div className='container'>
        <ReactEcharts ref='echarts_pie' option={this.getPieOption()}/>
      </div>
    );
  }
}

export default Stats;
