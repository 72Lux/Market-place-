(function() {
  module.exports = function(app) {
    var Controller;
    Controller = require('../controllers/marketplaceController');
    app.route('/marketPlace/token/:token').get(Controller.marketPlace);
    app.route('/marketPlace/token/:token').get(function(req, res) {
      return res.json({
        status: 'ok'
      });
    });
    return app.route('/marketPlaceProducts/token/:token').get(Controller.marketPlaceProducts);
  };

}).call(this);
