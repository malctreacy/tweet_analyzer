

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	// Find earliest tweet.
	var earliest_tweet = tweet_array[tweet_array.length - 1];
	// Find latest tweet.
	var latest_tweet = tweet_array[0];
	
	/* Filter separate arrays for: 
		1. completed events 
		2. live events 
		3. achievements
		4. miscellaneous events
	*/
	var miscEvents = tweet_array.filter(tweet => tweet.source == 'miscellaneous');
	var liveEvents = tweet_array.filter(tweet => tweet.source == 'live_event');
	var achievementEvents = tweet_array.filter(tweet => tweet.source == 'achievement');
	var completedEvents = tweet_array.filter(tweet => tweet.source == 'completed_event');
	var writtenEvents = completedEvents.filter(tweet => tweet.written == true);
	
	// DOM configuration for NUMBER of each type of event:
	$('#numberTweets').text(tweet_array.length);
	$('.completedEvents').text(completedEvents.length); 
	$('.liveEvents').text(liveEvents.length);
	$('.achievements').text(achievementEvents.length);
	$('.miscellaneous').text(miscEvents.length);
	$('.written').text(writtenEvents.length);
	
	// DOM configuration for PERCENTAGE of each type of event:
	$('.completedEventsPct').text(((completedEvents.length / tweet_array.length)*100).toFixed(2) + '%');
	$('.liveEventsPct').text(((liveEvents.length / tweet_array.length)*100).toFixed(2) + '%');
	$('.achievementsPct').text(((achievementEvents.length / tweet_array.length)*100).toFixed(2) + '%');
	$('.miscellaneousPct').text(((miscEvents.length / tweet_array.length)*100).toFixed(2) + '%');
	$('.writtenPct').text(((writtenEvents.length / completedEvents.length)*100).toFixed(2) + '%');
	
	//TODO: remove these
	$('#firstDate').text(earliest_tweet.time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
	$('#lastDate').text(latest_tweet.time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
	}
	

//Wait for the DOM to load
$(document).ready(function() {
	loadSavedRunkeeperTweets().then(parseTweets);
});