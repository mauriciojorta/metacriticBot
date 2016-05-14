var request = require('request');
var cheerio = require('cheerio');


var suggestion_searcher = (function() {

//Function which searches and returns suggestions for movies, tv series, videogames or music albums depending of the command passed by the parameter destiny 
	function search_suggestions(msg, destiny, sender_function)
	{
		var dest = destiny.replace(/-/g, " ");
		console.log(dest);
		   var options = {
	      url: 'http://www.metacritic.com/search/' + dest + '/results',
	      headers: {
	        'User-Agent': 'request'
	      },
	      enconding: 'ascii'
	    };
		
		    request(options, function(error, response, html){
		if (error)
		console.log(error);
        if(!error){
            var $ = cheerio.load(html);
            var suggestions;
			var message;
			var i=0;
			message = "Maybe you meant:  \n";
			
			$('ul.search_results.module').children().filter(function(){
					if ($(this).hasClass('result'))
					{
				var data = $(this).children().last().children().first();
				var title = data.children().first().children().first().text();
				var release = data.children().last().children().children().first().children().last().text();
				if ($(this).children().first().children().last().text().localeCompare($(this).children().first().children().first().text()))
				var type =  $(this).children().first().children().last().text() + ' ' + $(this).children().first().children().first().text();
			    else
				var type =  $(this).children().first().children().first().text();
				message = message + title + "\n" + "Type: " + type + "\n" + "Release date: " + release + "\n";	
				message = message + "\n";
					}				
            })
			var fromId = msg.chat.id;
                sender_function(fromId, message);
        }
			})
		
	
	}
	
		return {
		search_suggestions : search_suggestions
	}

})();

module.exports = suggestion_searcher;
