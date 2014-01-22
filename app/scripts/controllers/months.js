'use strict';

angular.module('yeomanTestApp')
  .controller('MonthsCtrl', function ($scope, JsonDayService, JsonHourService, JsonClientService, JsonWeekService) {

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

      //  prototype function to get adjusted month number from dates
      Date.prototype.getAdjustedMonthNumber = function(){
        var d = new Date(+this);
        var month = d.getMonth();
        var newCurrentMonth = 0;
        if (currentMonth < 6 && month < 6) {
          newCurrentMonth = currentMonth -12;
        };
        return month - newCurrentMonth;
      };

      //  convert all date strings into date time objects
      for (var a = 0; a < data.days.length; a++) {
        var splitDate;
        splitDate = data.days[a].day.split(/\-|\s/);
        data.days[a].day = new Date(splitDate.slice(0,3).join('/')+' '+splitDate[3]);
      }

      //  MONTH DATA --------------------------------
      // get all day data for DOM and graphs
      var monthData = $scope.weekData.months;
      var graphColors = {'impressions': '#3C6CE6', 'shares': '#F78F1E', 'fbclicks': '#10AAE9', 'conversions': '#f1c40f'};
      var lines = {};
      // loop that iterates over all properties of days object in JSON
      for (var i in monthData[0]) {
        // current month data
        var b = i+'MonthNow';
        $scope[b] = 0;
        for (var ii = 0; ii < 27; ii++) {
          $scope[b] = $scope[b] + data.days[ii][i];
        }
        // previous month data
        var monthPrevious = 0;
        for (var j = 28; j < 55; j++) {
          monthPrevious = monthPrevious + data.days[j][i];
        }
        // calculate the deltas
        var d = i+'MonthDelta';
        $scope[d] = Math.round((($scope[b]/monthPrevious)*100)-100)+'%';

        // 6 month graph data
        // get current date
        var currentDate = new Date();
        // get current month
        var currentMonth = currentDate.getMonth();
        //  for each day in day data
        for (var ii = 0; ii < data.days.length; ii++) {
          // iterate through every month to add data to each, one at a time
          for (var iii = 0; iii < monthData.length; iii++) {
            //  does current month number match loop number
            if (data.days[ii].day.getAdjustedMonthNumber() === iii) {
              // if match add data
              monthData[iii][i] = monthData[iii][i] + data.days[ii][i];
            }
          }
        }
        // set individual line arrays to take graph metrics
        lines[i] = [];
        // for each month in monthData
        for ( var x = 0; x < 13; x++) {
          // if month is within last 6 months
          if  ( currentDate.getAdjustedMonthNumber()-6 < x && x <= currentDate.getAdjustedMonthNumber() ) {
            // push metrics into array
            lines[i].push(monthData[x][i]);
          }
        }

        // set graph reference for dom
        var y = i +'Options';
        // month names has 17 months to account for different years
        var monthNames = [ 'Aug', "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
        var labelMonthArray = [];
        // create x-axis labels with relevant month names, push into array
        for ( var x = 0; x < 6; x++) {
          labelMonthArray.push(monthNames[currentDate.getMonth()+x]);
        }

        //  MONTH GRAPH
        $scope[i] = {
          labels : labelMonthArray,
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
        labels : labelMonthArray,
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
