var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var swig  = require('swig');
var React = require('react');
var Router = require('react-router');
var mongoose = require('mongoose');

var routes = require('./app/routes');
var Expenditure = require('./models/expenditure');
var config = require('./config');

var app = express();

/**
 * Express stuff
 */
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * POST /api/expenditure
 * Adds new expenditure item to the database.
 */
app.post('/api/expenditures', function(req, res, next) {
  try {
    var desc = req.body.desc;
    var category = req.body.category;
    var amount = req.body.amount;

    var expenditure = new Expenditure({
      desc: desc,
      category: category,
      amount: amount
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
 * Returns all the expenditures
 */
app.get('/api/expenditures', function(req, res, next) {
  Expenditure.find()
    .exec(function(err, expenditures) {
      if (err) return next(err);
      res.send(expenditures);
    });
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
