(function() {
  var app, config, express, getCatalogFromFrames, getProducts, http, path, server;

  express = require('express');

  http = require('http');

  path = require('path');

  config = require(path.join(__dirname, 'config'));

  app = module.exports = express();

  app.use(express["static"](__dirname + '/public'));

  app.set('views', __dirname + '/views');

  app.set('view engine', 'pug');

  app.set('port', 5550);

  getProducts = function(token, part_number) {
    return new Promise(function(resolve, reject) {
      var url;
      url = config.framesurl + '/v3/product/' + part_number;
      return request({
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        uri: url
      }, function(err, resp, body) {
        body = JSON.parse(body);
        return resolve(body);
      });
    });
  };

  getCatalogFromFrames = function(token, data) {
    return new Promise(function(resolve, reject) {
      var url;
      url = config.framesurl + '/v3/catalog?rows=25';
      console.log(data);
      if (data.merchantFilter !== '') {
        url = url + '&merchants=' + data.merchantFilter;
      }
      if (data.brandFilter !== '') {
        url = url + '&brands=' + data.brandFilter;
      }
      return request({
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        uri: url
      }, function(err, resp, body) {
        var merchant, promises, _i, _len, _ref;
        body = JSON.parse(body);
        data.merchants = [];
        data.products = [];
        _ref = body.navigation.merchants;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          merchant = _ref[_i];
          data.merchants.push(merchant.merchant);
        }
        promises = body.products.map(function(product) {
          return getProducts(token, product.part_number);
        });
        return Promise.all(promises).then(function(products) {
          var product, _j, _len1;
          for (_j = 0, _len1 = products.length; _j < _len1; _j++) {
            product = products[_j];
            data.products.push({
              price: product.price,
              url2: product.colors[0].sizes[0].url2,
              part_number: product.part_number,
              merchant: product.merchant,
              name: product.name,
              description: product.description,
              image: product.image,
              upc: product.colors[0].sizes[0].upc
            });
          }
          data.products = data.products;
          return resolve(data);
        });
      });
    });
  };

  app.get('/marketPlace/token/:token', function(req, res) {
    var data;
    data = {};
    data.productGroup = req.query.productGroup ? req.query.productGroup : '';
    data.token = req.params.token;
    data.merchantFilter = req.query.merchantFilter ? req.query.merchantFilter : '';
    data.brandFilter = req.query.brandFilter ? req.query.brandFilter : '';
    data.stylesheet = req.query.stylesheet ? req.query.stylesheet : '';
    console.log(data);
    return res.render('marketplace', data);
  });

  app.get('/marketPlaceProducts/token/:token', function(req, res) {
    var data;
    data = {};
    data.merchantFilter = req.query.merchantFilter;
    data.brandFilter = req.query.brandFilter;
    return getCatalogFromFrames(req.params.token, data).then(function(data) {
      return res.json(data);
    });
  });

  server = http.createServer(app).listen(app.get('port'), function() {
    return console.log('running');
  });

}).call(this);
