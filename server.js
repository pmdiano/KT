var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

var swig  = require('swig');
var React = require('react');
var Router = require('react-router');
var mongoose = require('mongoose');

var config = require('./config');
var routes = require('./app/routes');
var stats = require('./app/stats');
var exp = require('./models/expenditure');
var Expenditure = exp.model;

var app = express();

/**
 * Express stuff
 */
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));

/**
 * POST /api/expenditure
 * Adds new expenditure item to the database.
 */
app.post('/api/expenditures', function(req, res, next) {
  try {
    var desc = req.body.desc;
    var category = req.body.category;
    var amount = req.body.amount;
    var time = new Date();

    var expenditure = new Expenditure({
      desc: desc,
      category: category,
      amount: amount,
      date: time
    });

    expenditure.save(function(err) {
      if (err) return next(err);
      res.send({ message: 'Expenditure has been added successfully!' });
    });
  } catch (e) {
    res.status(500).send({ message: e });
  }
});

/**
 * GET /api/expenditures
 * Returns recent 50 expenditures
 */
app.get('/api/expenditures', function(req, res, next) {
  Expenditure.find().sort( { date: -1 } ).limit(50)
    .exec(function(err, expenditures) {
      if (err) return next(err);
      res.send(expenditures);
    });
});

/**
 * GET /api/stats
 * Returns the statistics of expenditure depending on the query
 */
app.get('/api/stats', function(req, res, next) {
  try {
    var type = req.query.type,
        since = stats.getTimeToQuery(type);

    Expenditure.find( { date: {$gt: since} })
      .exec(function(err, expenditures) {
        if (err) return next(err);
        res.send(expenditures);
      });

    // TODO: consolidate the data
  } catch (e) {
    res.status(500).send({ message: e });
  }
});

/**
 * React stuff
 */
app.use(function(req, res) {
  Router.run(routes, req.path, function(Handler) {
    var html = React.renderToString(React.createElement(Handler));
    var page = swig.renderFile('views/index.html', { html: html });
    res.send(page);
  });
});

/**
 * MongoDB stuff
 */
mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget run `mongod`?');
})

/**
 * Socket.io stuff.
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
 * Start!
 */
server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
