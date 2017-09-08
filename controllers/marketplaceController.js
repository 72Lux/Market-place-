(function() {
  var Model;

  Model = require("../models/marketplaceModel");

  exports.marketPlace = function(req, res) {
    var data;
    data = {};
    data.productGroup = req.query.productGroup ? req.query.productGroup : '';
    data.token = req.params.token;
    data.merchantFilter = req.query.merchantFilter ? req.query.merchantFilter : '';
    data.brandFilter = req.query.brandFilter ? req.query.brandFilter : '';
    data.stylesheet = req.query.stylesheet ? req.query.stylesheet : '';
    console.log('rendering');
    return res.render('marketplace', data);
  };

  exports.marketPlaceProducts = function(req, res) {
    var data;
    data = {};
    data.merchantFilter = req.query.merchantFilter;
    data.brandFilter = req.query.brandFilter;
    return Model.getCatalogFromFrames(req.params.token, data).then(function(data) {
      console.log('returning data');
      return res.json(data);
    })["catch"](function(err) {
      return res.send(err);
    });
  };

}).call(this);
