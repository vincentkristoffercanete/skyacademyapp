// Ionic Starter App

angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('skyacademy', [
  'ionic',
  'skyacademy.directives',
  'skyacademy.controllers',
  'skyacademy.views',
  'skyacademy.services',
  'skyacademy.config',
  'skyacademy.factories',
  'skyacademy.filters',
  'underscore',
  'ngCordova',
  'ngSanitize',
  'com.2fdevs.videogular',
  'com.2fdevs.videogular.plugins.controls',
  'com.2fdevs.videogular.plugins.buffering',
  'com.2fdevs.videogular.plugins.overlayplay',
  'ion-sticky'
])

.run(function($ionicPlatform, AuthService, $rootScope, $state, PushNotificationsService) {

  $ionicPlatform.on("deviceready", function(){

    AuthService.userIsLoggedIn().then(function(response)
    {
      if(response === true)
      {
        //update user avatar and go on
        AuthService.updateUserAvatar();

        $state.go('app.courses');
      }
      else
      {
        $state.go('walkthrough');
      }
    });

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    PushNotificationsService.register();

  });

  $ionicPlatform.on("resume", function(){
    AuthService.userIsLoggedIn().then(function(response)
    {
      if(response === false)
      {
        $state.go('walkthrough');
      }else{
        //update user avatar and go on
        AuthService.updateUserAvatar();
      }
    });

    PushNotificationsService.register();
  });

  // UI Router Authentication Check
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.data.authenticate)
    {
      AuthService.userIsLoggedIn().then(function(response)
      {
        if(response === false)
        {
          event.preventDefault();
          $state.go('walkthrough');
        }
      });
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('walkthrough', {
    url: "/",
    templateUrl: "views/auth/walkthrough.html",
    controller: 'WalkthroughCtrl',
    data: {
      authenticate: false
    }
  })

  .state('register', {
    url: "/register",
    templateUrl: "views/auth/register.html",
    controller: 'RegisterCtrl',
    data: {
      authenticate: false
    }
  })

  .state('login', {
    url: "/login",
    templateUrl: "views/auth/login.html",
    controller: 'LoginCtrl',
    data: {
      authenticate: false
    }
  })

  .state('forgot_password', {
    url: "/forgot_password",
    templateUrl: "views/auth/forgot-password.html",
    controller: 'ForgotPasswordCtrl',
    data: {
      authenticate: false
    }
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/app/side-menu.html",
    controller: 'AppCtrl'
  })

  .state('app.courses', {
    url: '/courses',
    views: {
      'menuContent': {
        templateUrl: "views/app/courses.html",
        controller: 'CoursesCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.episodes', {
    url: "/episodes/:courseId",
    views: {
      'menuContent': {
        templateUrl: "views/app/episodes.html",
        controller: 'EpisodesCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.video', {
    url: "/video/:videoId",
    views: {
      'menuContent': {
        templateUrl: "views/app/video.html",
        controller: 'VideoCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })


  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "views/app/settings.html",
        controller: 'SettingCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })




;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/courses');
})

;