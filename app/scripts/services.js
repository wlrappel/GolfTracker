(function() {
'use strict';

angular.module('golfTrackerApp')
.constant("baseURL", "https://localhost:3443/")
.factory('courseFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    var courseFac = {};
    
    var testObject = [
        {
            id: 1,
            name: "Golf Links Golf Course",
            address: "123 Main Street",
            city: "Anywhere",
            state: "State",
            zipcode: "12345",
            phone: "123-456-7890",
            summary: "Golf Links ya!",
            teeboxes: [
                {
                    id: 1,
                    color: "Blue"
                },
                {
                    id: 2,
                    color: "White"
                },
                {
                    id: 3,
                    color: "Red"
                }
            ]
        },
        {
            id: 2,
            name: "RainTree Golf Course",
            address: "8 Clubhouse Drive",
            city: "New York",
            state: "New York",
            zipcode: "12345",
            phone: "123-456-7890",
            summary: "It's rainy",
            teeboxes: [
                {
                    id: 1,
                    color: "Black"
                },
                {
                    id: 2,
                    color: "Gold"
                },
                {
                    id: 3,
                    color: "Green"
                }
            ]
        }
    ];
    
    courseFac.getCourses = function () {
        return testObject;
    };
    
    return courseFac;    
}])
.factory('roundFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    var roundFac = {};
    
    var testObject = [
        {
            id: 1,
            course: "Golf Links Golf Course",
            date: "2017-05-08",
            score: 85,
            tournament: undefined
        },
        {
            id: 2,
            course: "RainTree Golf Course",
            date: "2017-05-15",
            score: 80,
            tournament: "Test Tournament"
        }
    ];
    
    roundFac.getRounds = function () {
        return testObject;
    }
    
    roundFac.getRound = function(incId) {
        for(var i = 0; i < testObject.length; i++){
            if(testObject[i].id == incId){
                return testObject[i];
            }
        }
    }
    
    return roundFac;    
}])
.factory('tournamentFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    var tourneyFac = {};

    var testObject = [
        {
            id: 1,
            name: "Test Tournament",
            startDate: "2017-05-08T12:00:00.000000Z",
            endDate: undefined
        },
        {
            id: 2,
            name: "Test Tournament 2",
            startDate: "2017-05-01T09:00:00.000000Z",
            endDate: undefined
        }
    ];
    
    tourneyFac.getTournaments = function () {
        return testObject;
    }
    
    tourneyFac.getTournament = function(incId) {
        for(var i = 0; i < testObject.length; i++){
            if(testObject[i].id == incId){
                return testObject[i];
            }
        }
    }
    
    return tourneyFac;    
}])
// Commented out section is used for reference when we have a REST server operational
//.factory('commentFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
//
//        return $resource(baseURL + "dishes/:id/comments/:commentId", {id:"@Id", commentId: "@CommentId"}, {
//            'update': {
//                method: 'PUT'
//            }
//        });
//
//}])
//.factory('favoriteFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
//
//
//    return $resource(baseURL + "favorites/:id", null, {
//            'update': {
//                method: 'PUT'
//            },
//            'query':  {method:'GET', isArray:false}
//        });
//
//}])


.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog){
    
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var authToken = undefined;
    

  function loadUserCredentials() {
    var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
    if (credentials.username != undefined) {
      useCredentials(credentials);
    }
  }
 
  function storeUserCredentials(credentials) {
    $localStorage.storeObject(TOKEN_KEY, credentials);
    useCredentials(credentials);
  }
 
  function useCredentials(credentials) {
    isAuthenticated = true;
    username = credentials.username;
    authToken = credentials.token;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
  }
     
    authFac.login = function(loginData) {
        
        $resource(baseURL + "users/login")
        .save(loginData,
           function(response) {
              storeUserCredentials({username:loginData.username, token: response.token});
              $rootScope.$broadcast('login:Successful');
           },
           function(response){
              isAuthenticated = false;
            
              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + '</p><p>' +
                    response.data.err.name + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
           }
        
        );

    };
    
    authFac.logout = function() {
        $resource(baseURL + "users/logout").get(function(response){
        });
        destroyUserCredentials();
    };
    
    authFac.register = function(registerData) {
        
        $resource(baseURL + "users/register")
        .save(registerData,
           function(response) {
              authFac.login({username:registerData.username, password:registerData.password});
            if (registerData.rememberMe) {
                $localStorage.storeObject('userinfo',
                    {username:registerData.username, password:registerData.password});
            }
           
              $rootScope.$broadcast('registration:Successful');
           },
           function(response){
            
              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Registration Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + 
                  '</p><p>' + response.data.err.name + '</p></div>';

                ngDialog.openConfirm({ template: message, plain: 'true'});

           }
        
        );
    };
    
    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };
    
    authFac.getUsername = function() {
        return username;  
    };

    loadUserCredentials();
    
    return authFac;
    
}])
;
})();