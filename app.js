(function() {
  var app, express, http, port, routes, server;

  routes = require("./routes/router");

  express = require('express');

  app = module.exports = express();

  http = require('http');

  port = process.env.PORT || 5550;

  routes(app);

  app.use(express["static"](__dirname + '/public'));

  app.set('views', __dirname + '/views');

  app.set('view engine', 'pug');

  app.set('port', port);

  server = http.createServer(app).listen(app.get('port'), function() {
    return console.log('running');
  });

}).call(this);
