import React from 'react';
import ReactEcharts from 'echarts-for-react';
import StatsStore from '../stores/StatsStore';
import StatsActions from '../actions/StatsActions';

var categories = [
  'Clothes',
  'Food',
  'Transportation',
  'Housing',
  'Necessity',
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
    this.updateStackChart();
  }

  updatePieChart() {
    this.refs.echarts_pie.getEchartsInstance().setOption({
      title: {
        text: 'Daily average: ' + this.state.avgSpending,
        subtext: this.state.dates[0] + ' - today'
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

  updateStackChart() {
    this.refs.echarts_stack.getEchartsInstance().setOption({
      title: {
        text: 'Trend'
      },
      legend: {
        data: categories
      },
      xAxis: {
        data: this.state.dates
      },
      series: this.state.statsSeries.map(function(item) {
        item.stack = 'foo';
        item.type = 'bar';
        return item;
      })
    });
  }

  getPieOption() {
    var option = {
      title : {
        text: 'Daily average: ',
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
        bottom: 'middle',
        selectedMode: false,
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

  getStackOption() {
    var option = {
      title : {
        text: '',
        x:'center'
      },
      tooltip : {
        trigger: 'axis',
        axisPointer : {         // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'       // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        show: false,
        data:[]
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          data : []
        }
      ],
      yAxis : [
        {
          type : 'value'
        }
      ],
      series : []
    };

    return option;
  }

  render() {
    return (
      <div className='container'>
        <ReactEcharts
          ref='echarts_pie'
          option={this.getPieOption()}
          style={{height: '250px', width: '100%'}}>
        </ReactEcharts>
        <ReactEcharts
          ref='echarts_stack'
          option={this.getStackOption()}
          style={{height: '320px', width: '100%'}}>
        </ReactEcharts>
      </div>
    );
  }
}

export default Stats;
