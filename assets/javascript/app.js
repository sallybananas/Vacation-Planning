// GifTastic Javascript Engine

// begin document.ready function
$(document).ready(function() {

// ====================
// FIRST COME VARIABLES
// ====================

// make a giftastic object to hold variables and functions
// elements of the object include the following
// places: array of all places used to populate buttons
// currentSelection: the button the user pressed (if needed)
// userInput: the places the user entered via the form
// giphyApiUrl: the base url for giffy api access
// giphyApiKey: public beta key for non-production giphy usage 
// renderButtons: function to render the buttons
// displayGifs: function to display gifs that correspond to button click
// and also to toggle between animated and still
var giftasticObj = {
	places: ["New York City", "Chicago", "Las Vegas", "San Francisco", "London", "Paris", "Rome", "Berlin", "Madrid", "Amsterdam"],
	currentSelection: "",
	userInput: "",
	giphyApiUrl: "https://api.giphy.com/v1/gifs/search?",
	giphyApiKey: "iHfLD40zAGGpcIFpmFsXhySDc9f8uday",
	renderButtons: function() {
		// first empty the buttons bar/column
		$("#buttonsBar").empty();
		// then cycle through the places array and populate the buttons
		for (var i = 0; i < this.places.length; i++) {
			var a = $("<button>");
			a.addClass("buttons btn btn-primary");
			a.attr("data-name", this.places[i]);
			a.text(this.places[i]);
			$("#buttonsBar").append(a);
		}
		// then add on-clicks for each of the buttons
		$(".buttons").on("click", function() {
			// console.log("button pressed");
			// in this case, this refers to the button clicked
			giftasticObj.currentSelection = $(this).attr("data-name");
			giftasticObj.displayGifs();
		});
	},
	displayGifs: function() {
		console.log(this.currentSelection);
		// first build the ajax query based on current button clicked
		var tvShowToDisplay = this.currentSelection;
		// use an &limit of 12 to grab 12 images
		var queryURL = this.giphyApiUrl + "&q=" + tvShowToDisplay + "&limit=12&api_key=" + this.giphyApiKey;

		// make the ajax query and store the response
		$.ajax({url: queryURL, method: "GET"}).done(function(response) {
			console.log(response);
			// begin by emptying out the gifsWindow div
			$("#gifsWindow").empty();
			for (var i = 0; i < response.data.length; i++) {
				// cycle through the json object data from the api
				// and store the object in showObject
				// and the still image in showStill
				// and the moving image in showMoving
				// and the rating in showRating
				// and console log them all out to verify
				var showObject = response.data[i];
				var showStill = response.data[i].images.fixed_height_small_still.url;
				var showMoving = response.data[i].images.fixed_height_small.url;
				var showRating = response.data[i].rating;
				console.log("Object: " + showObject);
				console.log("Still: " + showStill);
				console.log("Moving: " + showMoving);
				console.log("Rating: " + showRating);


				// start building the div that the show images will go in
				// also attach a class called show for future use if needed
				// since we're using bootstrap, use col-md-4 as a class
				// for the div to help with alignment within its row
				var showDiv = $("<div class='show col-md-4'>");
				// first in the div will be the rating
				var pOne = $("<p>").text("Image Rating: " + showRating);
				// append the rating into the div
				showDiv.append(pOne);
				// next will come the image starting in still mode
				var image = $("<img>").attr("src", showStill);
				// attach a myShowImage class to the image and store
				// the still image and the moving image links in data attributes
				image.addClass("myShowImage");
				image.attr("data-still", showStill);
				image.attr("data-moving", showMoving);
				// append the image into the div
				showDiv.append(image);
				// finally append the constructed div into the gifsWindow div
				$("#gifsWindow").append(showDiv);
			}

			// create on clicks for each image that has been displayed
			$(".myShowImage").on("click", function() {
				// when clicked, if the src attribute is the same as the still image
				// data attribute then change the src attribute to the moving image
				// data attribute. Conversely, when clicked, if the src attribute is
				// the same as the moving image data attribute then change the src
				// attribute to the still image attribute
				// basically this acts like a toggle on the image
				if ($(this).attr("src") == $(this).attr("data-still")) {
					$(this).attr("src", $(this).attr("data-moving"));
				} else if ($(this).attr("src") == $(this).attr("data-moving")) {
					$(this).attr("src", $(this).attr("data-still"));
				}

			});

		});
	}
};

// =========================
// NOW THE FUNCTIONS AND APP
// =========================

// add an on-click for the form at the top of the
// page so user can add additional destinations / buttons
$("#addPlace").on("click", function() {
	giftasticObj.userInput = $("#searchPlace").val().trim();
	// ignore submit button click if nothing has been entered
	// because we don't want to create empty buttons
	if (giftasticObj.userInput != "") {
		// add the place to the array and render buttons again
		giftasticObj.places.unshift(giftasticObj.userInput);
		giftasticObj.renderButtons();
	}
	// reset the form
	$("input#searchPlace").val("");
	return false;
});


// begin by rendering buttons at start of page load or upon refresh
giftasticObj.renderButtons();

// end document.ready function
});