(function() {
  var config, getProducts, request;

  config = require('./../config');

  request = require('request');

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

  exports.getCatalogFromFrames = function(token, data) {
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

}).call(this);
