import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import routes from './routes';

Router.run(routes, Router.HistoryLocation, function(Handler) {
  /**
   * TODO: if use ReactDOM.render, it will throw following error:
   * Uncaught Error: addComponentAsRefTo(...): Only a ReactOwner can have
   * refs. You might be adding a ref to a component that was not created
   * inside a component's `render` method, or you have multiple copies of
   * React loaded (details: https://fb.me/react-refs-must-have-owner)
   */
  ReactDOM.render(<Handler />, document.getElementById('app'));
});
