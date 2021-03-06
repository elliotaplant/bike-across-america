angular.module('bikeAcrossAmerica', [
  'bikeAcrossAmerica.services',
  'bikeAcrossAmerica.auth',
  'bikeAcrossAmerica.home',
  'bikeAcrossAmerica.profile',
  'ngRoute'
])
.filter('testFilter', function() {
  return function(username) {
    console.log(username)
  };
})
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .when('/home', {
      templateUrl: 'app/home/home.html',
      controller: 'HomeController',
      authenticate: true
    })
    .when('/profile', {
      templateUrl: 'app/profile/profile.html',
      controller: 'ProfileController',
      authenticate: true
    })
    .otherwise({
      redirectTo: '/home'
    })

    $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.bikeAcrossAmerica');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});
