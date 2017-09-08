(function() {
  var autoClose_handler, marketplaceController;

  marketplaceController = function($scope, $http, $q, $window) {
    var getProducts, init;
    init = function() {
      return getProducts().then(function(data) {
        return $scope.findingProducts = false;
      });
    };
    getProducts = function() {
      var deferred, url;
      deferred = $q.defer();
      url = "/marketPlaceProducts/token/" + $scope.token + "?merchantFilter=" + $scope.merchantFilter + "&brandFilter=" + $scope.brandFilter;
      $http.get(url).then(function(results) {
        var data;
        data = results.data;
        $scope.products = data.products;
        $scope.merchants = data.merchants;
        return deferred.resolve(true);
      });
      return deferred.promise;
    };
    $scope.buy = function(part_number) {
      $window.parent.postMessage('pop_pdp|' + part_number, '*');
      return console.log('pdp popped');
    };
    $scope.view = function(url2) {
      if (url2) {
        return $window.parent.location = url2;
      }
    };
    $scope.findingProducts = true;
    return $scope.$watch("token", function() {
      return init();
    });
  };

  angular.module('MarketPlace', ['ngAnimate', 'ngMaterial']).controller('marketplaceController', marketplaceController);

  autoClose_handler = function() {
    return Cart.close_cart();
  };

}).call(this);
