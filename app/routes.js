import React from 'react';
import {Route, NotFoundRoute} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import AddExpenditure from './components/AddExpenditure';
import Stats from './components/Stats';

export default (
  <Route handler={App}>
    <Route path='/' handler={Home} />
    <Route path='/add' handler={AddExpenditure} />
    <Route path='/stats/:type' handler={Stats} />
  </Route>
);
