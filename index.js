var YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";
// var numberPages = 0;
var nextPage = 0;
var prevPage = 0;
var query;
var state = [];


function addToState(newobj) {
	state.push(newobj);
}


function buildBox(x) {
	var box = '<div class="js-response-box">' + 
						'<p class="js-title"><i>' + state[x].title + '</i></p>' +
						'<p class="js-desc">' + state[x].desc + '</p>' +
						'<p class="js-desc">Published: ' + state[x].pubDate + '</p>' +
						'<p><a href="https://www.youtube.com/watch?v=' + state[x].videoID + '"target="_blank">' +
						'<img class="js-link" src=' + state[x].thumbnail + ' alt="YouTube video link">' + 
						'</a></p></div>';
	return box;
}


function renderState() {
	var page = '';
	for (var i=0; i < state.length; i++) {
		page = page + buildBox(i);
		$('.js-response-container').html(page);
	} 
	//
	//	unhide the prev button if the first
	//  page is being displayed. Always unhide
	//  the next button.
	//
	$('.js-next').removeClass('hidden');
	if (prevPage === undefined) {
		$('.js-prev').addClass('hidden');
	} else {
		$('.js-prev').removeClass('hidden');
	}
}


function displayResults(data) {
	// numberPages += 1;
	nextPage = data.nextPageToken;
	prevPage = data.prevPageToken;
	state = [];
	for (var i=0; i < data.items.length; i++) {
		//
		//  save the data in the array
		//
		addToState({videoID: data.items[i].id.videoId,
								title: data.items[i].snippet.title,
							  desc: data.items[i].snippet.description,
								pubDate: data.items[i].snippet.publishedAt.substring(0,10),
								thumbnail: data.items[i].snippet.thumbnails.medium.url,});
	}; //end of for loop
	renderState();
}  // end of displayResults


function createObj(page) {
	var paramObj = {
					part: 'snippet',
					key: 	'AIzaSyCVj_TB8yxxUwB5_x-WSj90qlNYxjLSejU',
					q: 		query,
					maxResults: '6',
					pageToken: page
			}
	getJ(paramObj, displayResults);
}


function getJ(searchobject, callback) {
	$.getJSON(YOUTUBE_BASE_URL, 
						searchobject,
						callback)
}


$(function() {
	'use strict';
	//
	//  Event handler for search request
	//
	$('#js-search').submit(function(event) {
		event.preventDefault();
		query = $(this).find('.js-value').val();
		//
		//  format the api search request
		//
		var paramsObj = {
					part: 'snippet',
					key: 	'AIzaSyCVj_TB8yxxUwB5_x-WSj90qlNYxjLSejU',
					q: query,
					maxResults: '6',
					};
		//
		//  submit with a callback function
		//
		getJ(paramsObj, displayResults);
	});

	//
	//  Event handler for previous and next buttons
	//
	$('.button-container').on('click', '.js-prev', function(event) {
			event.preventDefault();
			createObj(prevPage);
			// numberPages -= 1;
	});

	$('.button-container').on('click', '.js-next', function(event) {
			event.preventDefault();
			createObj(nextPage);
			// numberPages += 1;

	});

})
