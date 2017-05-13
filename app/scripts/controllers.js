(function(){
    'use strict';

    angular.module('golfTrackerApp')
    // This controller will be in charge of all tournament data.  Create tournaments, edit tournaments, and view tournaments
    .controller('TournamentController', ['$scope', '$stateParams', 'ngDialog', 'tournamentFactory', function ($scope, $stateParams, ngDialog, tournamentFactory) {
        $scope.newTournament = {name: '',
                               startDate: undefined,
                               endDate: undefined};

        $scope.tournamentDetail = {}; 
        
        $scope.setTournamentDetailObject = function(){
            $scope.tournamentDetail = tournamentFactory.getTournament($stateParams.tourneyID);
        }
        
        $scope.tournaments = tournamentFactory.getTournaments();

        // This method opens a dialog to create a new tournament
        $scope.openTourneyCreate = function () {
            ngDialog.open({ template: 'views/tournament/tourneyCreate.html', scope: $scope, className: 'ngdialog-theme-default', controller:"TournamentController" });
        };

        $scope.doTournamentCreate = function() {
            ngDialog.close();
        };
    }])
    .controller('ScoreController', ['$scope', '$stateParams', 'ngDialog', 'courseFactory', 'roundFactory', function ($scope, $stateParams, ngDialog, courseFactory, roundFactory) {
        $scope.newScore = {};

        $scope.rounds = roundFactory.getRounds();
        $scope.courses = courseFactory.getCourses();
        
        $scope.selectedCourse = $scope.courses[0];
        $scope.selectedTeeBox = $scope.selectedCourse.teeboxes[0];

        $scope.scoreDetail = {}; 
        $scope.setScoreDetailObject = function(){
            $scope.scoreDetail = roundFactory.getRound($stateParams.scoreID);
        }
        
        $scope.openAddScore = function () {
            ngDialog.open({ template: 'views/score/scoreAdd.html', scope: $scope, className: 'ngdialog-theme-default', controller:"ScoreController" });
        }

        $scope.doAddScore = function() {
            ngDialog.close();
        };
    }])
    // The commented out code is used for reference from the confusion application created in previous courses
    //.controller('DishDetailController', ['$scope', '$state', '$stateParams', 'menuFactory', 'commentFactory', function ($scope, $state, $stateParams, menuFactory, commentFactory) {
    //
    //    $scope.dish = {};
    //    $scope.showDish = false;
    //    $scope.message = "Loading ...";
    //
    //    $scope.dish = menuFactory.get({
    //            id: $stateParams.id
    //        })
    //        .$promise.then(
    //            function (response) {
    //                $scope.dish = response;
    //                $scope.showDish = true;
    //            },
    //            function (response) {
    //                $scope.message = "Error: " + response.status + " " + response.statusText;
    //            }
    //        );
    //
    //    $scope.mycomment = {
    //        rating: 5,
    //        comment: ""
    //    };
    //
    //    $scope.submitComment = function () {
    //
    //        commentFactory.save({id: $stateParams.id}, $scope.mycomment);
    //
    //        $state.go($state.current, {}, {reload: true});
    //        
    //        $scope.commentForm.$setPristine();
    //
    //        $scope.mycomment = {
    //            rating: 5,
    //            comment: ""
    //        };
    //    }
    //}])
    //.controller('FavoriteController', ['$scope', '$state', 'favoriteFactory', function ($scope, $state, favoriteFactory) {
    //
    //    $scope.tab = 1;
    //    $scope.filtText = '';
    //    $scope.showDetails = false;
    //    $scope.showDelete = false;
    //    $scope.showMenu = false;
    //    $scope.message = "Loading ...";
    //
    //    favoriteFactory.query(
    //        function (response) {
    //            $scope.dishes = response.dishes;
    //            $scope.showMenu = true;
    //        },
    //        function (response) {
    //            $scope.message = "Error: " + response.status + " " + response.statusText;
    //        });
    //
    //    $scope.select = function (setTab) {
    //        $scope.tab = setTab;
    //
    //        if (setTab === 2) {
    //            $scope.filtText = "appetizer";
    //        } else if (setTab === 3) {
    //            $scope.filtText = "mains";
    //        } else if (setTab === 4) {
    //            $scope.filtText = "dessert";
    //        } else {
    //            $scope.filtText = "";
    //        }
    //    };
    //
    //    $scope.isSelected = function (checkTab) {
    //        return ($scope.tab === checkTab);
    //    };
    //
    //    $scope.toggleDetails = function () {
    //        $scope.showDetails = !$scope.showDetails;
    //    };
    //
    //    $scope.toggleDelete = function () {
    //        $scope.showDelete = !$scope.showDelete;
    //    };
    //    
    //    $scope.deleteFavorite = function(dishid) {
    //        console.log('Delete favorites', dishid);
    //        favoriteFactory.delete({id: dishid});
    //        $scope.showDelete = !$scope.showDelete;
    //        $state.go($state.current, {}, {reload: true});
    //    };
    //}])

    // Home controller will have Player, Tournaments, and Scores factory
    .controller('HomeController', ['$scope', 'roundFactory', 'tournamentFactory', function ($scope, roundFactory, tournamentFactory) {
        $scope.rounds = roundFactory.getRounds();
        $scope.tournaments = tournamentFactory.getTournaments();
    }])
    .controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

        $scope.loggedIn = false;
        $scope.username = '';

        if(AuthFactory.isAuthenticated()) {
            $scope.loggedIn = true;
            $scope.username = AuthFactory.getUsername();
        }

        $scope.openLogin = function () {
            ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
        };

        $scope.logOut = function() {
           AuthFactory.logout();
            $scope.loggedIn = false;
            $scope.username = '';
        };

        $rootScope.$on('login:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
        });

        $rootScope.$on('registration:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
        });

        $scope.stateis = function(curstate) {
           return $state.is(curstate);  
        };

        $scope.openAddScore = function () {
            ngDialog.open({ template: 'views/score/scoreAdd.html', scope: $scope, className: 'ngdialog-theme-default', controller:"ScoreController" });
        }
    }])
    .controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

        $scope.loginData = $localStorage.getObject('userinfo','{}');

        $scope.doLogin = function() {
            if($scope.rememberMe)
               $localStorage.storeObject('userinfo',$scope.loginData);

            AuthFactory.login($scope.loginData);

            ngDialog.close();

        };

        $scope.openRegister = function () {
            ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
        };

    }])
    .controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

        $scope.register={};
        $scope.loginData={};

        $scope.doRegister = function() {
            console.log('Doing registration', $scope.registration);

            AuthFactory.register($scope.registration);

            ngDialog.close();

        };
    }])
    ;
})();