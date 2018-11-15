/*
Name: Malcolm Treacy
Last Edited: 10/23/18
Description: This code edits the DOM of activities HTML file to display
information about the activity types people are tweeting. 
*/

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	// Create Array of Activities to be Mapped to Activity Count (Activity Count)
	var activities = ['Running', 'Hiking', 'Walking', 'Jogging', 'Swimming', 'Biking', 'Group Workout', "Gym Workout", 'Something Else'];
	// Create Array of Counts to be Mapped to Activity Type (Activities)
	var activityCount = [0,0,0,0,0,0,0,0,0];
	// Parse tweets and catagorize/count each tweet.
	for (var i = 0; i < tweet_array.length; i++){
		if ( tweet_array[i].activityType == 'Running'){
			activityCount[0]++;
		}
		else if ( tweet_array[i].activityType == 'Hiking'){
			activityCount[1]++;
		}
		else if ( tweet_array[i].activityType == 'Walking'){
			activityCount[2]++;
		}
		else if ( tweet_array[i].activityType == 'Jogging'){
			activityCount[3]++;
		}
		else if ( tweet_array[i].activityType == 'Swimming'){
			activityCount[4]++;
		}
		else if ( tweet_array[i].activityType == 'Biking'){
			activityCount[5]++;
		}
		else if ( tweet_array[i].activityType == 'Group Workout'){
			activityCount[6]++;
		}
		else if ( tweet_array[i].activityType == 'Gym Workout'){
			activityCount[7]++;
		}
		else if( tweet_array[i].activityType == 'Something Else'){
			activityCount[8]++;
		}
	}
	// Map the two array together into a 2d array of activities and counts [activity, count]
	var orderedActivityCounts = activities.map(function(e, i) {
	  return [e, activityCount[i]];
	});
	
	// Sort in ascending order according to activity count
	orderedActivityCounts.sort(function(a,b){
    	return a[1] - b[1];
	});
	// Output Activity-Count Array (testing purposes).
	//console.log(orderedActivityCounts);
	
	//  Visualization: Number of Each Activity
	var numberActivities = {
	  "data": {
	    "values": [
	    ]
	  },
	  "mark": "bar",
	  "encoding": {
	    "x": {"field": "Activity", "type": "nominal"},
	    "y": {"field": "Count", "type": "quantitative"}
	  }
	};
	
	// Parse Data for Number of Activities
	var activityCnt = new Object();
	activityCnt.Activity = "";
	activityCnt.Count = 0;
	
	// Activity Count Array
	var activityCountArray = new Array;
	for (var row = 0; row < orderedActivityCounts.length; row++){
		for( var col = 0; col < orderedActivityCounts[row].length; col++){
			if(col == 0){
				activityCnt.Activity = orderedActivityCounts[row][col];
			}
			if(col == 1){
				activityCnt.Count = orderedActivityCounts[row][col];
			}
		}
		//console.log(activityCnt);
		let newObj = JSON.parse(JSON.stringify(activityCnt));
		activityCountArray.push(newObj);
	}
	
	numberActivities.data.values = activityCountArray;
	
	//  Visualization: AVERAGE Distance Per Day
	var averageDistancePerDay = 
	{
	  "$schema": "https://vega.github.io/schema/vega-lite/v2.6.json",
	  "description": "A scatterplot showing horsepower and miles per gallons.",
	  "data": {
		"values": [
		   {
		      "Distance": 5,
		      "Day": "1 Sunday",
		      "Activity":"Jogging"
		   },
		   {
		      "Distance": 2,
		      "Day": "1 Sunday",
		      "Activity":"Biking"
		   },
		   {
		      "Distance": 10,
		      "Day": "2 Monday",
		      "Activity":"Running"
		   },
		   {
		      "Distance": 2,
		      "Day": "2 Monday",
		      "Activity":"Running"
		   }
		]},
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "Day", "type": "nominal"},
	    "y": {"aggregate": "mean","field": "Distance", "type": "quantitative"},
	    "color": {"field": "Activity", "type": "nominal"},
	    "shape": {"field": "Activity", "type": "nominal"}
	  }
	};

	
	function returnDate(dateString){
		var day = dateString.split(' ');
		day = day[0];
		if (day == 'Sun'){
			return '1 Sunday';
		}
		if (day == 'Mon'){
			return '2 Monday';
		}
		if (day == 'Tue'){
			return '3 Tuesday';
		}
		
		if (day == 'Wed'){
			return '4 Wednesday';
		}
		if (day == 'Thu'){
			return '5 Thursday';
		}
		if (day == 'Fri'){
			return '6 Friday';
		}
		if (day == 'Sat'){
			return '7 Saturday';
		}
		
	}
	
	var value = new Object();
	value.Day = "";
	value.Distance = 0;
	value.Activity = "";

	
	var data = new Array();
	for(i = 0; i < tweet_array.length; i++){
		if( tweet_array[i].source == 'completed_event' ){
			if( tweet_array[i].activityType == orderedActivityCounts[8][0] ){
				value.Activity = tweet_array[i].activityType;
				value.Distance = tweet_array[i].distance;
				value.Day = returnDate(String(tweet_array[i].time));
			}
			if( tweet_array[i].activityType == orderedActivityCounts[7][0] ){
				value.Activity = tweet_array[i].activityType;
				value.Distance = tweet_array[i].distance;
				value.Day = returnDate(String(tweet_array[i].time));
			}
			if( tweet_array[i].activityType == orderedActivityCounts[6][0] ){
				value.Activity = tweet_array[i].activityType;
				value.Distance = tweet_array[i].distance;
				value.Day = returnDate(String(tweet_array[i].time));
			}
		}
		let newObj = JSON.parse(JSON.stringify(value));
		data.push(newObj);
	}
	
	
	

	var distancePerDay = 
	{
	  "$schema": "https://vega.github.io/schema/vega-lite/v2.6.json",
	  "description": "A scatterplot showing horsepower and miles per gallons.",
	  "data": {
		"values": [
		   {
		      "Distance": 5,
		      "Day": "1 Sunday",
		      "Activity":"Jogging"
		   },
		   {
		      "Distance": 2,
		      "Day": "1 Sunday",
		      "Activity":"Biking"
		   },
		   {
		      "Distance": 10,
		      "Day": "2 Monday",
		      "Activity":"Running"
		   },
		   {
		      "Distance": 2,
		      "Day": "2 Monday",
		      "Activity":"Running"
		   }
		]},
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "Day", "type": "nominal"},
	    "y": {"field": "Distance", "type": "quantitative"},
	    "color": {"field": "Activity", "type": "nominal"},
	    "shape": {"field": "Activity", "type": "nominal"}
	  }
	};
	
	averageDistancePerDay.data.values = data;
	distancePerDay.data.values = data;
	
	function showMean(){
		vegaEmbed("#distanceVis", averageDistancePerDay);
		$("#aggregate").text('Show All Distances');
	}
	function showAll(){
		vegaEmbed("#distanceVis", distancePerDay);
		$("#aggregate").text('Show Avg. Distances');
	}
	vegaEmbed("#distanceVis", distancePerDay);
	vegaEmbed("#activityCount", numberActivities);
	
	$("#aggregate").clicktoggle(showMean,showAll);
	$('#numberActivities').text(activities.length);
	$('#firstMost').text(orderedActivityCounts[8][0]);
	$('#secondMost').text(orderedActivityCounts[7][0]);
	$('#thirdMost').text(orderedActivityCounts[6][0]);
	
}

// https://stackoverflow.com/questions/17583215/jquery-toggle-event-deprecated-what-to-use
$.fn.clicktoggle = function(a, b) {
    return this.each(function() {
        var clicked = false;
        $(this).click(function() {
            if (clicked) {
                clicked = false;
                return b.apply(this, arguments);
            }
            clicked = true;
            return a.apply(this, arguments);
        });
    });
};

//Wait for the DOM to load
$(document).ready(function() {
	loadSavedRunkeeperTweets().then(parseTweets);
});