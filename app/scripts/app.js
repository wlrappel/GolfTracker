(function(){
    
"use strict";

angular.module('golfTrackerApp', ['ui.router','ngResource','ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html'
                    }
                }
            })
            // route for list of player rounds
            .state('app.scoreList', {
               url:'scoreList',
               views: {
                   'content@': {
                       templateUrl: 'views/score/scoreList.html',
                       controller: 'ScoreController'
                   }
               }
            })
            // route for a specific round
            .state('app.scoreDetail', {
               url:'scoreDetail/:scoreID',
               views: {
                   'content@': {
                       templateUrl: 'views/score/scoreDetail.html',
                       controller: 'ScoreController'
                   }
               }
            })
           // route to add a round
           .state('app.scoreAdd', {
               url:'scoreAdd',
               views: {
                   'content@': {
                       templateUrl: 'views/score/scoreAdd.html',
                       controller: 'ScoreController'
                   }
               }
            })
           // route to create a tournament
           .state('app.tourneyCreate', {
               url:'tourneyCreate',
               views: {
                   'content@': {
                       templateUrl: 'views/tournament/tourneyCreate.html',
                       controller: 'TournamentController'
                   }
               }
            })
           // route to see list of tournaments
           .state('app.tourneyList', {
               url:'tourneyList',
               views: {
                   'content@': {
                       templateUrl: 'views/tournament/tourneyList.html',
                       controller: 'TournamentController'
                   }
               }
            })
           // route to see a specific tournament details
           .state('app.tourneyStandings', {
               url:'tourneyStandings/:tourneyID',
               views: {
                   'content@': {
                       templateUrl: 'views/tournament/tourneyStandings.html',
                       controller: 'TournamentController'
                   }
               }
            });
    
        $urlRouterProvider.otherwise('/');
    })
;
})();
