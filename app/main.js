import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import routes from './routes';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

Router.run(routes, Router.HistoryLocation, function(Handler) {
  ReactDOM.render((
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <Handler />
    </MuiThemeProvider>
    ), document.getElementById('app'));
});
