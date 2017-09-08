module.exports = (app) ->
  Controller = require('../controllers/marketplaceController');

  app.route('/marketPlace/token/:token')
    .get(Controller.marketPlace);

  app.route('/marketPlaceProducts/token/:token')
    .get(Controller.marketPlaceProducts);
