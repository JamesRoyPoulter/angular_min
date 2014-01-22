'use strict';

angular.module('yeomanTestApp')
  .controller('WeeksCtrl', function ($scope, JsonDayService, JsonHourService, JsonClientService, JsonWeekService) {

    // get client JSON
    JsonClientService.get(function(data){
      $scope.clientName = data.client;
      $scope.clientType = data.type;
      $scope.clientURL = data.url;
    });

    //  get week JSON
    JsonWeekService.get(function(data){
      $scope.weekData = data;
    });

    // get days JSON
    JsonDayService.get(function(data){

      // prototype function to get week number from dates
      Date.prototype.getWeekNumber = function(){
          var d = new Date(+this);
          d.setHours(0,0,0);
          d.setDate(d.getDate()+4-(d.getDay()||7));
          return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
        };

      // prototype function to get adjusted week number from dates
      Date.prototype.getAdjustedWeekNumber = function(){
        var d = new Date(+this);
        var week = d.getWeekNumber();
        var newCurrentWeek = 0;
        d.setHours(0,0,0);
        d.setDate(d.getDate()+4-(d.getDay()||7));
        var test3 = Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
        if (currentWeek < 8 && week < 8) {
          newCurrentWeek = currentWeek - 54;
        }
        return week - newCurrentWeek;
      };

      //  convert all date strings into date time objects
      for (var a = 0; a < data.days.length; a++) {
        var splitDate;
        splitDate = data.days[a].day.split(/\-|\s/);
        data.days[a].day = new Date(splitDate.slice(0,3).join('/')+' '+splitDate[3]);
      }

      // WEEK DATA ---------------------------------------
      // get all day data for DOM and graphs
      var weekData = $scope.weekData.weeks;
      var graphColors = {'impressions': '#3C6CE6', 'shares': '#F78F1E', 'fbclicks': '#10AAE9', 'conversions': '#f1c40f'};
      var lines = {};
      // loop that iterates over all properties of days object in JSON
      for (var i in weekData[0]) {
        // current week
        var b = i+'WeekNow';
        $scope[b] = 0;
        for (var ii = 0; ii < 6; ii++) {
          $scope[b] = $scope[b] + data.days[ii][i];
        }
        // previous week
        var weekPrevious = 0;
        for (var j = 7; j < 13; j++) {
          weekPrevious = weekPrevious + data.days[j][i];
        }
        // deltas
        var d = i+'WeekDelta';
        $scope[d] = Math.round((($scope[b]/weekPrevious)*100)-100)+'%';

        // 8 week graph data
        // get current date
        var currentDate = new Date();
        // get current week
        var currentWeek = currentDate.getWeekNumber();
        //  for each day in day data
        for (var ii = 0; ii < data.days.length; ii++) {
            // iterate through every week to add data to each, one at a time
            for (var iii = 0; iii <currentDate.getAdjustedWeekNumber(); iii++) {
              //  does current week number match loop number
              if (data.days[ii].day.getAdjustedWeekNumber() === iii) {
                // if match add data
                weekData[iii][i] = weekData[iii][i] + data.days[ii][i];
              }
            }
        }
        // set individual line arrays to take graph metrics
        lines[i] = [];
        // for each week in weekData
        for ( var x = 0; x < 55; x++) {
          // if week is within last 8 weeks
          if  ( currentDate.getAdjustedWeekNumber()-9 < x
            && x < currentDate.getAdjustedWeekNumber() ) {
            // push metrics into array
            lines[i].push(weekData[x][i]);
          }
        }

        // set graph reference for dom
        var y = i +'Options';
        // month names has 17 months to account for different years
        // var monthNames = [ "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
        // var labelMonthArray = [];
        // // create x-axis labels with relevant month names, push into array
        // for ( var x = 0; x < 6; x++) {
        //   labelMonthArray.push(monthNames[currentDate.getMonth()+x]);
        // }

        //  WEEK GRAPH
        $scope[i] = {
          labels : [currentWeek-7,currentWeek-6,currentWeek-5,currentWeek-4,currentWeek-3,currentWeek-2,currentWeek-1,currentWeek],
          datasets : [
              {
                fillColor : 'rgba(151,187,205,0)',
                strokeColor : graphColors[i],
                pointColor : 'rgba(151,187,205,0)',
                pointStrokeColor : graphColors[i],
                data : lines[i]
              }
            ],
          };
        // the actul graph options
        $scope[y] = {
          scaleLineColor : 'rgba(0,0,0,.1)',
          // scaleOverride : true,
          //Number - The number of steps in a hard coded scale
          scaleSteps : 6,
          //Number - The value jump in the hard coded scale
          scaleStepWidth : 300,
          //Number - The scale starting value
          scaleStartValue : 0,
        };
      }

      // main graph outside of loop
      var mainGraphLines = [];
      for (var i in lines) {
        mainGraphLines.push(lines[i]);
      }
      $scope.mainData = {
        labels : [currentWeek-7,currentWeek-6,currentWeek-5,currentWeek-4,currentWeek-3,currentWeek-2,currentWeek-1,currentWeek],
        datasets : [
            {
                fillColor : 'rgba(151,187,205,0)',
                strokeColor : graphColors['impressions'],
                pointColor : 'rgba(151,187,205,0)',
                pointStrokeColor : graphColors['impressions'],
                data : mainGraphLines[0]
              },
              {
                fillColor : 'rgba(151,187,205,0)',
                strokeColor : graphColors['shares'],
                pointColor : 'rgba(151,187,205,0)',
                pointStrokeColor : graphColors['shares'],
                data : mainGraphLines[1]
              },
              {
                fillColor : 'rgba(151,187,205,0)',
                strokeColor : graphColors['fbclicks'],
                pointColor : 'rgba(151,187,205,0)',
                pointStrokeColor : graphColors['fbclicks'],
                data : mainGraphLines[2]
              },
              {
                fillColor : 'rgba(151,187,205,0)',
                strokeColor : graphColors['conversions'],
                pointColor : 'rgba(151,187,205,0)',
                pointStrokeColor : graphColors['conversions'],
                data : mainGraphLines[3]
              }
          ],
        };
      $scope.mainOptions = {
        scaleLineColor : 'rgba(0,0,0,.1)',
        // scaleOverride : true,
        //Number - The number of steps in a hard coded scale
        scaleSteps : 6,
        //Number - The value jump in the hard coded scale
        scaleStepWidth : 300,
        //Number - The scale starting value
        scaleStartValue : 0,
      };
    });
  });
