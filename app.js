var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs      = require('fs');

var app = express();

app.get('/', function(req, res) {
	var url = 'http://www.imdb.com/title/tt1229340/';

	var movie_json = { title : "", release : "", rating : ""};

	request(url, function(error, response, html) {
		if(!error) {
			var $ = cheerio.load(html);

			var title, release, rating;

			$('.header').filter(function() {
				var data = $(this);

				title = data.children().first().text();

				movie_json.title = title;

				release = data.children().last().children().text();

				movie_json.release = release;
			});

			$('.star-box-giga-star').filter(function() {
				var data = $(this);

				rating = data.text();

				movie_json.rating = rating;
			});
		}
	});

	fs.writeFile('output.json', JSON.stringify(movie_json, null, 4), function(err) {
		console.log('File successfully written! - check your project directory.');
	});

	res.send(movie_json);
});

app.listen('12345', function() {
	console.log('Listening on port 12345');
});
