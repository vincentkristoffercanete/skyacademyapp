angular.module('skyacademy.controllers', [])

// APP
.controller('AppCtrl', function($scope, $ionicActionSheet, $ionicModal, $state, AuthService, PostService) {

  $scope.user = AuthService.getUser();

  var promise = PostService.getPmproAccount($scope.user.data.id);
  promise.then(function(data){
    $scope.pmpro = data;
  });

  $ionicModal.fromTemplateUrl('views/app/settings.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.settings_modal = modal;
  });

  $ionicModal.fromTemplateUrl('views/app/terms.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.terms_modal = modal;

    var promise = PostService.getPageContent(3549);
    promise.then(function(data){
      $scope.terms = data;
    });

  });

  $ionicModal.fromTemplateUrl('views/app/policy.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.policy_modal = modal;

    var promise = PostService.getPageContent(3556);
    promise.then(function(data){
      $scope.policy = data;
    });

  });

  $ionicModal.fromTemplateUrl('views/app/account.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.account_modal = modal;
  });

  $scope.showSettings = function() {
    $scope.settings_modal.show();
  };

  $scope.showTerms = function() {
    $scope.terms_modal.show();
  };

  $scope.showPolicy = function() {
    $scope.policy_modal.show();
  };


  $scope.showAccount = function() {
    $scope.account_modal.show();
  };


  // Triggered on a the logOut button click
  $scope.showLogOutMenu = function() {

      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        //Here you can add some more buttons

        titleText: 'Are you sure you want to logout?',
        destructiveText: 'Logout',
        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          return true;
        },
        destructiveButtonClicked: function(){
          AuthService.logOut();
          $scope.settings_modal.hide();
          $state.go('login');
        }
      });
    
  };

})


// WALKTHROUGH
.controller('WalkthroughCtrl', function($scope, $state, $ionicSlideBoxDelegate) {

  $scope.$on('$ionicView.enter', function(){
    //this is to fix ng-repeat slider width:0px;
    $ionicSlideBoxDelegate.$getByHandle('walkthrough-slider').update();
  });
})

//LOGIN
.controller('LoginCtrl', function($scope, $state, $ionicLoading, AuthService, PushNotificationsService) {
  $scope.user = {};

  $scope.doLogin = function(){

    $ionicLoading.show({
      template: '<ion-spinner icon="ios-small"></ion-spinner> Logging in'
    });

    var user = {
      userName: $scope.user.userName,
      password: $scope.user.password
    };

    AuthService.doLogin(user)
    .then(function(user){
      //success
      $state.go('app.courses');

      $ionicLoading.hide();
    },function(err){
      //err
      $scope.error = err;
      $ionicLoading.hide();
    });
  };
})


// FORGOT PASSWORD
.controller('ForgotPasswordCtrl', function($scope, $state, $ionicLoading, AuthService) {
  $scope.user = {};

  $scope.recoverPassword = function(){

    $ionicLoading.show({
      template: 'Recovering password...'
    });

    AuthService.doForgotPassword($scope.user.userName)
    .then(function(data){
      if(data.status == "error"){
        $scope.error = data.error;
      }else{
        $scope.message ="Link for password reset has been emailed to you. Please check your email.";
      }
      $ionicLoading.hide();
    });
  };
})


// REGISTER
.controller('RegisterCtrl', function($scope, $state, $ionicLoading, AuthService, PushNotificationsService) {
  $scope.user = {};

  $scope.doRegister = function(){

    $ionicLoading.show({
      template: 'Registering user...'
    });

    var user = {
      userName: $scope.user.userName,
      password: $scope.user.password,
      email: $scope.user.email,
      displayName: $scope.user.displayName
    };

    AuthService.doRegister(user)
    .then(function(user){
      //success
      $state.go('app.courses');
      $ionicLoading.hide();
    },function(err){
      //err
      $scope.error = err;
      $ionicLoading.hide();
    });
  };
})

//COURSES
.controller('CoursesCtrl', function($scope, $rootScope, $state, $http, $ionicLoading, PostService) {
    $ionicLoading.show({
      template: '<ion-spinner icon="ios-small"></ion-spinner> Loading Courses'
    });
    var promise = PostService.getCourses();
    promise.then(function(data){
      $scope.two_units = data.courses.two_unit;
      $scope.bonus_units = data.courses.bonus;
      $scope.three_units = data.courses.three_unit;
      $ionicLoading.hide();
      $scope.isloaded = true;
    });
})

//EPISODES
.controller('EpisodesCtrl', function($scope, $rootScope, $stateParams, $state, $http, $ionicLoading, PostService) {
  $ionicLoading.show({
    template: '<ion-spinner icon="ios-small"></ion-spinner> Loading Episodes'
  });

  var courseId = $stateParams.courseId;
  var promise = PostService.getCourseInfo(courseId);
  promise.then(function(data){
    $scope.course = data;
  });

  var promise = PostService.getEpisodes(courseId);
  promise.then(function(data){
    $scope.episodes = data;
    $ionicLoading.hide();
  });


})

//VIDEO
.controller('VideoCtrl', function($scope, $stateParams, $ionicLoading, PostService, $sce, $ionicNavBarDelegate, $window, $document) {
  $ionicLoading.show({
    template: '<ion-spinner icon="ios-small"></ion-spinner> Loading Video'
  }); 

  var controller = this;
  controller.API = null;

  var videoId = $stateParams.videoId;
  var promise = PostService.getVideo(videoId);
  promise.then(function(data){
    $scope.video = data;
    var urlRegex = /(https?:\/\/[^\s"]+)/g;
    var video_src = "";
    $scope.video[0].content.rendered.replace(urlRegex, function(url) {
        video_src = url.trim();
    });
    $scope.platform = ionic.Platform.platform();
    if($scope.platform == 'ios'){
      $ionicNavBarDelegate.showBar(true);
    }else{
      $ionicNavBarDelegate.showBar(false);
    }
    controller.config = {
        playsInline: true,
        preload: "auto",
        autoPlay: true,
        sources: [
            {src: $sce.trustAsResourceUrl(video_src), type: "video/mp4"}
        ],
        plugins: {
          controls: {
              autoHide: false,
              autoHideTime: 3000
          }
        }
    };
    $ionicLoading.hide();
    document.addEventListener("deviceready", function() {
      screen.unlockOrientation();
    });
    
    ShowHideControlBar();
      
    window.addEventListener("orientationchange", function(){
      ShowHideControlBar();
    });

    function ShowHideControlBar(){
        if(screen.orientation.type == "landscape-primary"){
          controller.config.plugins.controls.autoHide = true;
        }
        if(screen.orientation.type == "portrait-primary"){
          controller.config.plugins.controls.autoHide = false;
        }
      }

  });

})


;