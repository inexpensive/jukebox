var app = angular.module('jukebox', ['ngMaterial']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]')
});

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('jukeboxTheme')
        .primaryPalette('blue')
});

app.controller('jukeboxCtrl', function($scope, $http, $mdToast, $interval, $mdSidenav) {

    $scope.search = function() {
        $http({
            method : 'GET',
            url : '/search/',
            params : {search_box: $scope.query}
        }).then(function success(response) {
            $scope.search_results = response.data;
        }, function failure(response) {
            $scope.search_results = response.data;
        });
    };

    $scope.addSong = function (song) {
        $http({
            method : 'POST',
            url : '/add/',
            data : song.track
        }).then(function success() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Added ' + song.track.title + ' to the playlist')
                    .hideDelay(3000)
                    .position('top right')
            )
        }, function failure() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Failed to add the song')
                    .hideDelay(3000)
                    .position('top right')
            )
        })
    };

    $scope.addStation = function (song) {
        $mdToast.show(
            $mdToast.simple()
                .textContent('Creating a station based on ' + song.track.title)
                .hideDelay(3000)
                .position('top right')
        );
        $http({
            method : 'POST',
            url : '/add_station/',
            data : song.track
        }).then(function success() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Added 25 songs based on' + song.track.title + ' to the playlist')
                    .hideDelay(4000)
                    .position('top right')
            )
        }, function failure() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Failed to create a station')
            )
        })
    };

    $scope.addNext = function (song) {
        $http({
            method : 'POST',
            url : '/add_next/',
            data : song.track
        }).then(function success() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Added ' + song.track.title + ' as the next song in the playlist')
                    .hideDelay(3000)
                    .position("top right")
            )
        }, function failure() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Failed to add the song')
                    .hideDelay(3000)
                    .position('top right')
            )
        })
    };

    $scope.millisToMinutesAndSeconds = function (millis) {
        var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    seconds = (seconds == 60 ? 0 : seconds);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    };

    $scope.updateCurrentlyPlaying = function () {
        $http({
            method : 'GET',
            url : '/current/'
        }). then(function success(response) {
            $scope.currentlyPlaying = response.data;
            $scope.songProgress = response.data.duration == 0 ? 0 : response.data.elapsed / response.data.duration * 100;
        })
    };

    $scope.play = function () {
        $http({
            method : 'GET',
            url : '/play/'
        })
    };

    $scope.pause = function () {
        $http({
            method : 'GET',
            url : '/pause/'
        })
    };

    $scope.skip = function () {
        $http({
            method : 'GET',
            url : '/skip/'
        })
    };

    $scope.getPlaylist = function () {
        $http({
            method : 'GET',
            url : '/playlist/'
        }).then(function success(response) {
            $scope.playlist = response.data;
        })
    };

    $scope.removeSong = function (index) {
        $http({
            method : 'POST',
            url : '/remove/',
            data : {index : index}
        }).then(function success(response) {
            $scope.playlist = response.data;
        })
    };

    $scope.showPlaylist = false;

    $interval($scope.updateCurrentlyPlaying, 1000);
    $interval($scope.getPlaylist, 2500);
});