var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope) {

    $scope.framework= "AngularJS";
    $scope.graph = require("./resources/HalfCheetah-v2_benchmark.png");

});

export class myApp