config = require ('./../config')
request = require('request');
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
    
        


exports.getCatalogFromFrames = (token, data)->
   
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