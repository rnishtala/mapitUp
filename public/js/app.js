// Declares the initial angular module "mapitUp". Module grabs other controllers and services.
var app = angular.module('mapitUp', ['addCtrl', 'queryCtrl', 'geolocation', 'gservice', 'ngRoute'])

    //Configures Angular routing -- showing the relevant view amd controller when needed
    .config(function($routeProvider){

        //Join Team Control Panel
        $routeProvider.when('/join', {
            controller: 'addCtrl' ,
            templateUrl: 'partials/addForm.html',

            // Find Teammates Control Panel
        }).when('/find', {
            controller: 'queryCtrl',
            templateUrl: 'partials/queryForm.html',

            // All else forward to the Join Team Control Panel
        }).otherwise({redirectTo:'/join'})
    });
