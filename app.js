
(function(){
    'use strict';
    var app=angular.module('flickrapp',['ngMaterial','kendo.directives','ui.bootstrap'])
    .controller('ListController',['$scope','$http','$uibModal',function($scope,$http,$uibModal){
        $scope.results=[];
        $scope.isSearching=false;
        $scope.searchImage='';

        $scope.search=function(){
            $scope.isSearching=true;

           myDataSource.page(1);
        }

        //KendoGrid Start

        var myDataSource = new kendo.data.DataSource({
            serverPaging: true,
            serverSorting: true,
            pageSize: 100,

            type:'json',
            requestStart: function () {
            },
            transport: {
                read: function (options) {
                    $scope.isSearching=true;
                    $http({
                        method: 'GET',

                        url: 'https://www.flickr.com/services/rest',
                        contentType:'application/x-www-form-urlencoded',
                        params: {
                            method: $scope.searchImage==''?'flickr.photos.getRecent':'flickr.photos.search',
                            api_key: '35ab4be9e6966d365fb7a3248aa7330b',
                            format:'json',
                            nojsoncallback:1,
                           // auth_token:'72157710563907618-cbe92558ef6c3ee5',
                           // api_sig: '3ec0f338293ff243cf3a4259a7ca054c',
                            tags: $scope.searchImage,
                            per_page: myDataSource.pageSize(),
                            page: myDataSource.page()
                        }
                    }).then(function (response) {
                            options.success(response.data.photos);
                            $scope.isSearching=false;

                        },
                        function (err) { });
                },
            },

            schema: {
                data: "photo",
                total: "total"

            },
        });

        $scope.myGridOption = {
            dataSource: myDataSource,

            pageable: {
                pageSizes: [10, 25, 50, 100],
                refresh: true,
                change: function (e) { }
            },
            sortable: {
                allowUnsort: true
            },
            noRecords: {
                template: "No items to display."
            },
            height: 550,
            resizable: true,
            scrollable: true,
            columns: [
                {
                    field: "View",
                    title: "Action",
                    sortable: false,
                    template:
                        '<button type="button" class="k-button" data-button-id="\'#= id #\'" ng-click="ViewImage(this.dataItem)" class="btn btn-default btn-xs"><i class="fa fa-edit"></i> <span>View</span> </button>',
                }, {
                    field: "id",
                    hidden:true
                },
                {
                    field: "title",
                    title: "Title of Image"

                }, {
                    field: "farm",
                    title: 'Farm'
                },
                {
                    field: "server",
                    title: 'Server'
                },
                {
                    field: "secret",
                    title: 'Secret'
                },{
                    field:"Photo",
                    title:"Photo",
                    template:'<img ng-src="https://farm#: farm #.staticflickr.com/#: server #/#: id #_#:secret #_b.jpg" alt="" style="width: 40px">'
                }
            ],
            //rowTemplate: '<tr data-uid="#= uid #" data-id="#= ContractNumber #"> <td>#:Advertiser #</td></tr>',

            dataBound: function (e) {
                // triggers when all data is binded to the grid
            },
            dataBinding: function (e) { //triggers before grid binds data

            },
        };
        $scope.ViewImage=function (data) {

         var modalInstance =  $uibModal.open({
            templateUrl: "modelTemplate.html",
             scope: $scope
         });
         $scope.imagedata=data;
        $scope.imagesource='https://farm'+data.farm+'.staticflickr.com/'+data.server+"/"+data.id+"_"+data.secret+"_b.jpg" ;

            $scope.ok = function(){
                modalInstance.close("Ok");
            }
        }

    }])
})();