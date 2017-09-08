marketplaceController = ($scope, $http, $q,$window)->
    init =()->
        getProducts()
        .then (data)->
            $scope.findingProducts =false
    
    getProducts = ()->
        deferred = $q.defer();
        url = "/marketPlaceProducts/token/"+$scope.token+"?merchantFilter="+ $scope.merchantFilter+"&brandFilter="+ $scope.brandFilter
        
        
        $http.get url 
        .then (results)->
            data = results.data
            $scope.products = data.products
            $scope.merchants =data.merchants
            deferred.resolve(true)
        return deferred.promise
    $scope.buy= (part_number)->
        $window.parent.postMessage('pop_pdp|'+part_number,'*' )
        console.log('pdp popped')
    $scope.view = (url2)->
        if url2
            $window.parent.location = url2
    $scope.findingProducts =true 
    $scope.$watch "token", ()->  
        init() 


angular
    .module 'MarketPlace',['ngAnimate', 'ngMaterial']
    .controller 'marketplaceController', marketplaceController

autoClose_handler = ()->
    Cart.close_cart();
