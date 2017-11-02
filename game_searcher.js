var request = require('request');
var cheerio = require('cheerio');


var game_searcher = (function() {

//Function which searches and returns basic data from a videogame passed as a parameter by destiny
function search_game(msg, destiny, sender_function)
	{
		var game = destiny.split('/');
		game = game[1];
		//Converts abbreviations to full console names used in metacritic database
		destiny = destiny.replace(/ps4/, "playstation-4");
		destiny = destiny.replace(/ps3/, "playstation-3");
		destiny = destiny.replace(/ps2/, "playstation-2");
		destiny = destiny.replace(/ps/, "playstation");
		destiny = destiny.replace(/n64/, "nintendo-64");
		destiny = destiny.replace(/gc/, "gamecube");
		destiny = destiny.replace(/gba/, "game-boy-advance");
		destiny = destiny.replace(/gb/, "game-boy");
	    //We need to send an user-agent to get metacritic's answer
	    var options = {
	      url: 'http://www.metacritic.com/game/' + destiny + '/',
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
            var title, release, description, critic_rating, user_rating;
			var message;
			var i = 0;
			var j = 0;
			var error = 0;
			
			$('.error_code').filter(function(){

                var data = $(this).text();
           if (data.localeCompare('404') == 0)
	       error = 1;
            })
			
            $('.product_title').filter(function(){

                var data = $(this).children().first().children().first();

                title = data.text();
				
				console.log("Title:" + title);
           if(j<1)
           message = title + "\n";
	       j++;

            })
			
				$('.summary_detail.release_data').filter(function(){

                var data = $(this).children().last();
                release = data.text();
           message = message + "Release date: " + release + "\n";
            })
			message = message + "\n";	
			
			$('.summary_detail.product_summary').filter(function(){

                var data = $(this).children().last().children().first().children().eq(1);

				if (data.attr('itemprop') === 'description')
				{
                description = data.text();
				if (description.length>4096)
				{
					data = $(this).children().last().children().first().children().eq(0);
					description = data.text();
				}
				}
			else
			{
				data = $(this).children().last().children().first();
				description = data.text();
			}
           message = message + "Summary: " + description + "\n \n";
            })
			message = message + "\n";
			
			$('.metascore_w.xlarge').filter(function(){

                var data = $(this);

               critic_rating  = data.children().last().text();

           message = message + "Critics rating: " + critic_rating +"/100 \n";

            })
			
			$('.metascore_w.user.large').filter(function(){

                var data = $(this);

               user_rating  = data.text();
           if (i<1)
           message = message + "Users rating: " + Number(user_rating)*10 +"/100 \n";
		   i++;

            })
			if (error==1)
			{
				       message = "The game doesn't exists or can't be found. Check if you wrote its name correctly." + 
		   "If it has a remake or several remakes, write its year at the end";
		   var fromId = msg.chat.id;
                sender_function(fromId, message);
				search_suggestions(msg, game, sender_function);
				
			}
			else
			{
			var fromId = msg.chat.id;
                sender_function(fromId, message);
			}
        }
    })  
	}
	
	//Function which searches and returns videogame suggestions if a search by search_game fails to find any coincidence
	function search_suggestions(msg, destiny, sender_function)
	{
		var dest = destiny.replace(/-/g, " ");
		console.log(dest);
		   var options = {
	      url: 'http://www.metacritic.com/search/game/' + dest + '/results',
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
				var type =  $(this).children().first().children().last().text() + ' ' + $(this).children().first().children().first().text();
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
		search_game : search_game
	}

})();

module.exports = game_searcher;
