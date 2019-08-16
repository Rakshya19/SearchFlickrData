
(function(){
    'use strict';
    angular.module('flickrapp',['ngMaterial'])
    .controller('ListController',['$scope','$http',function($scope,$http){
        $scope.results=[];
        $scope.isSearching=false;

        $scope.search=function(){

            $scope.isSearching=true;
            $http({
                method: 'GET',
                url: 'https://api.flicker.com/services/rest',function (res) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");

            },
                contentType:'application/x-www-form-urlencoded',
                params: {
                    method: 'flickr.photos.search',
                    api_key: '479b4fbe5d60749623c3edd6584f53fa',
                    text: $scope.searchImage,
                    format:'json',
                    nojsoncallback:1

                }
        }).then(function(response){
                $scope.results=response;
                $scope.isSearching=false;
            })
        }
    }])
})();