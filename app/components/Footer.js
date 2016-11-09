import React from 'react';
import {Link} from 'react-router';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <footer>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-12'>
              <h4 className='lead'><strong>Information</strong> and <strong>Copyright</strong></h4>
              <p>A simple application to keep track of spending. Powered by <strong>Node.js</strong>, <strong>MongoDB</strong>, <strong>React</strong> and <strong>ECharts</strong>. Inspired by Sahat Yalkobov's <a href='http://www.kancloud.cn/kancloud/create-voting-app/63976'>tutorial</a>.</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
