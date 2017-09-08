(function() {
  module.exports = function(app) {
    var Controller;
    Controller = require('../controllers/marketplaceController');
    app.route('/marketPlace/token/:token').get(Controller.marketPlace);
    return app.route('/marketPlaceProducts/token/:token').get(Controller.marketPlaceProducts);
  };

}).call(this);
