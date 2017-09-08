Model = require("../models/marketplaceModel")
exports.marketPlace = (req,res)->
    data ={}
    data.productGroup = if req.query.productGroup then req.query.productGroup else ''
    data.token = req.params.token
    data.merchantFilter =if  req.query.merchantFilter then  req.query.merchantFilter else ''
    data.brandFilter =if  req.query.brandFilter then  req.query.brandFilter else ''
    data.stylesheet = if req.query.stylesheet  then req.query.stylesheet else ''
    console.log('rendering')
    res.render 'marketplace', data

exports.marketPlaceProducts =  (req,res)->
    data ={}
   
    data.merchantFilter = req.query.merchantFilter
    data.brandFilter = req.query.brandFilter
    Model.getCatalogFromFrames req.params.token, data 
    .then (data)->
        console.log('returning data')
        res.json data
    .catch (err) ->
        res.send(err)
    