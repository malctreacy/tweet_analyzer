/*
Name: Malcolm Treacy
Last Edited: 10/23/18
Description: This code edits the DOM of the .description HTML file to display
an interface for searching through the tweets. 
*/

var written_tweets;

/*
Description: parseTweets
	1. Gather tweets with hashtag #runkeeper.
	2. Create an array of object Tweet (defined in tweet.ts)
	3. Filter for written text only .writtenText (defined in tweet.ts)

Source: https://github.com/uci-inf-133/a2-tweets
Author: Malcolm Treacy
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
	
	written_tweets = tweet_array.filter(tweet => tweet.writtenText);
}

/*
Description: populateTableBody

	1. Creates a new table body (empty).
	2. Clears table if searchTerm is empty.
	3. Filter and return tweet filtered by search term.
	4. Create new table row td's
	5. Append td', tr's to tbody
	6. Return newly created tbody
	
Input: Search term (string).
Return: New table body (or empty).
*/
function populateTableBody(searchTerm){
	// Create and empty tbody.
	var newTableBody = document.createElement('tbody');
	
	// Check if search term is empty, if empty clear tbody.
	if (searchTerm == ''){
		$('#searchCount').text('???');
		$('#searchText').text('???');
		return newTableBody;
	}

	// Search  and return tweets filtered by search term.
	var tweets_by_search_term = written_tweets.filter(tweet => tweet.text.includes(searchTerm));
	$('#searchCount').text(tweets_by_search_term.length);
	
	// Loop construct for create tr's and td's according to search results.
	for( var i = 0; i < tweets_by_search_term.length; i++){
		var tr = document.createElement('tr');
		for(var j = 0; j < 3; j++){
			var td = document.createElement('td');
			if (j == 0){
				// Numbering for tweets
				td.appendChild(document.createTextNode(i + 1));
			}
			if (j == 1){
				// Column for activity type (completed_event, achievement, etc.)
				td.appendChild(document.createTextNode(tweets_by_search_term[i].source));
			}
			if (j == 2){
				// Parse hyperlink, remove it from text, create and append new 'a' element, attatch hyperlink
				var hL = /(https?:\/\/[^\s]+)/g;
				// Save hyperlink
				var hyperLink = tweets_by_search_term[i].text.match(hL);
				// Remove hyperlink from text
				var textToDisplay = tweets_by_search_term[i].text.replace(hL, "");
				// Append text to td
				td.appendChild(document.createTextNode(textToDisplay));
				// Create new link node
				var link = document.createElement('a');
				// Link text
				var linkText = document.createTextNode('More Information.');
				// Append link text to a element
				link.appendChild(linkText);
				// Reference removed link
				link.href = hyperLink;
				// Add link to td
				td.appendChild(link);
			}
			
			// Append to new table row
			tr.appendChild(td);
		}
		// Append row to tbody
		newTableBody.appendChild(tr);
	}
	// Return updated table body
	return newTableBody;

}

/*
Description: Monitors input events in the search term box to generate new table
on every key entry.

	1. Monitor key events.
	2. Gather current search term.
	3. Generate new tbody based on seach term. 
	4. Replace old tbody with new tbody.
	
Input: None, event-driven.
Return: None. 
*/
function addEventHandlerForSearch() {
	$('#textFilter').on("input", function() {
		var searchTerm = this.value;
		$('#searchText').text(searchTerm);
		$('tbody').replaceWith(populateTableBody(searchTerm));
	});
	
}

// Wait for the DOM to load.
$(document).ready(function() {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});