module.exports = (app) ->
  Controller = require('../controllers/marketplaceController');

  app.route('/marketPlace/token/:token')
    .get(Controller.marketPlace);
  app.route('/marketPlace/token/:token')
    .get (req,res)->
        res.json {status:'ok'}
        
  app.route('/marketPlaceProducts/token/:token')
    .get(Controller.marketPlaceProducts);
