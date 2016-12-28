var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

var swig  = require('swig');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var Router = require('react-router');
var mongoose = require('mongoose');

var config = require('./config');
var routes = require('./app/routes');
var api = require('./app/api');

var app = express();

/**
 * Express
 */
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));

/**
 * APIs
 */
app.get('/api/expenditures', api.getExpenditures);
app.get('/api/stats', api.getStats);
app.post('/api/expenditures', api.postExpenditure);

/**
 * React
 */
app.use(function(req, res) {
  Router.run(routes, req.path, function(Handler) {
    var html = ReactDOMServer.renderToString(React.createElement(Handler));
    var page = swig.renderFile('views/index.html', { html: html });
    res.send(page);
  });
});

/**
 * MongoDB
 */
mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget run `mongod`?');
})

/**
 * Socket.io
 */
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var onlineUsers = 0;

io.sockets.on('connection', function(socket) {
  onlineUsers++;

  io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

  socket.on('disconnect', function() {
    onlineUsers--;
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
  });
});

/**
 * Start
 */
server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
