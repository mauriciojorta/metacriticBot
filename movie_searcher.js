var request = require('request');
var cheerio = require('cheerio');


var msearcher = (function() {
	//Callback for get_first_result function
	function callback(msg, destiny, sender_function)
	{
		search_movie(msg, destiny, sender_function);	
	}
	
	//Funcion which catches and send to parse the link of the first result of a search. Unused due to some problems.
	function get_first_result(msg, destiny, sender_function)
	{
			var dest = destiny;
			var flag=0;
		console.log(dest + ' destino');
		   var options = {
	      url: 'http://www.metacritic.com/search/movie/' + dest + '/results',
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
			
			$('ul.search_results.module').children().filter(function(){
					if ($(this).hasClass('first_result'))
					{
						console.log('entre aquí');
				var data = $(this).children().last().children().first();
				var link = data.children().first().children().first().children().first().attr('href');
				result=link;
				console.log(link + ' titulo');
				console.log(result + ' resultado');
				flag=1;
				callback(msg, result, sender_function);
					}				
            })
			if (flag==0)
			search_suggestions(msg, destiny, sender_function);
			
        }
			})
	}
//Function which searches and returns basic data from a movie passed as a parameter by destiny
function search_movie(msg, destiny, sender_function)
	{
		var dest = destiny;
		console.log (dest + ' destino busqueda');
	    //We need to send an user-agent to get metacritic's answer
	    var options = {
	      url: 'http://www.metacritic.com/movie/' + dest + '/',
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
            var title, release, starring, description, critic_rating, user_rating;
			var message;
			var i = 0;
			var error = 0;
			
			$('.error_code').filter(function(){

                var data = $(this).text();
           if (data.localeCompare('404') == 0)
	       error = 1;
            })
			
            $('.hover_none').filter(function(){

                var data = $(this);

                title = data.children().first().text();

           message = title + "\n";

            })
			
				$('.summary_detail.release_data').filter(function(){

                var data = $(this).children().last();
                release = data.text();
           message = message + "Release date: " + release + "\n";
            })
			message = message + "\n";	
			starring = "";
			$('.summary_detail.product_credits').children().last().children().filter(function(){
                var data = $(this)
				if (data.attr('itemprop') === 'actor')
				{
				var starr = data.children().first().children().first().text();
				starring = starring + starr + ", ";
				}
            })
			message = message + "Starring: " + starring + "\n";
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
				       message = "The movie doesn't exists or can't be found. Check if you wrote its name correctly." + 
		   "If it has a remake or several remakes, write its year at the end";
		   var fromId = msg.chat.id;
                sender_function(fromId, message);
				search_suggestions(msg, destiny, sender_function);
				
			}
			else
			{
			var fromId = msg.chat.id;
                sender_function(fromId, message);
			}
        }
    })  
	}
	
	//Function which searches and returns movie suggestions if a search fails to find any coincidence
	function search_suggestions(msg, destiny, sender_function)
	{
		var dest = destiny.replace(/-/g, " ");
		console.log(dest);
		   var options = {
	      url: 'http://www.metacritic.com/search/movie/' + dest + '/results',
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
				var type = $(this).children().first().children().first().text();
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
		search_movie : search_movie,
		get_first_result: get_first_result
	}

})();

module.exports = msearcher;
