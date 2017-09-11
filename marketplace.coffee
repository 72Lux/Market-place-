express = require('express');


http = require('http');
path = require 'path'
config = require(path.join(__dirname, 'config'));
app = module.exports = express();
app.use(express["static"](__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.set('port', 5550);


getProducts  = (token,part_number)->
    new Promise (resolve, reject) ->
        url = config.framesurl+'/v3/product/'+part_number
        request { 
          method: 'GET',
          headers: 
            'Authorization': 'Bearer ' + token

          uri: url
        }, (err,resp,body)->
            body = JSON.parse body
            resolve(body)
    
        


getCatalogFromFrames = (token, data)->
   
    new Promise (resolve, reject) ->
        url = config.framesurl+'/v3/catalog?rows=25'
        console.log data
        if data.merchantFilter isnt ''
            url = url + '&merchants='+data.merchantFilter
        if data.brandFilter isnt ''
            url = url + '&brands='+data.brandFilter
        
       
        request { 
          method: 'GET',
          headers: 
            'Authorization': 'Bearer ' + token

          uri: url
        }, (err,resp,body)->
            body = JSON.parse body
           
            data.merchants = []
            data.products =  []
            for merchant in body.navigation.merchants  
                data.merchants.push merchant.merchant

            promises =  body.products.map (product)->
                getProducts token, product.part_number
            Promise.all promises
            .then (products)->
                for product in products
                    
                    data.products.push { 
                      price:product.price
                      url2:product.colors[0].sizes[0].url2
                      part_number: product.part_number
                      merchant:product.merchant
                      name:product.name
                      description:product.description
                      image: product.image
                      upc: product.colors[0].sizes[0].upc
                    }
                data.products = data.products
                resolve data
        
        
app.get '/marketPlace/token/:token', (req,res)->
    data ={}
    data.productGroup = if req.query.productGroup then req.query.productGroup else ''
    data.token = req.params.token
    data.merchantFilter =if  req.query.merchantFilter then  req.query.merchantFilter else ''
    data.brandFilter =if  req.query.brandFilter then  req.query.brandFilter else ''
    data.stylesheet = if req.query.stylesheet  then req.query.stylesheet else ''
    console.log(data)
    res.render 'marketplace', data

app.get '/marketPlaceProducts/token/:token' , (req,res)->
    data ={}
    data.merchantFilter = req.query.merchantFilter
    data.brandFilter = req.query.brandFilter
    getCatalogFromFrames req.params.token, data 
    .then (data)->
        res.json data
    
        
 server = http.createServer(app).listen app.get('port'), ()-> 
     console.log('running');
