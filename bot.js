#!/bin/env node
var TelegramBot = require('node-telegram-bot-api');
var movie_searcher = require('./movie_searcher');
var tvsearcher = require('./tvseries_searcher');
var suggestion_searcher = require('./suggestion_searcher');
var game_searcher = require('./game_searcher');
var album_searcher = require('./album_searcher');

// Bot setup
var token = 'YOUR TOKEN';

// Setup webhook
var bot = new TelegramBot(token);
bot.setWebHook('YOUR WEBHOOK' + bot.token);


console.log('bot server started...');
// End bot setup

//Callback for wrapping bot.sendMessage
function sendMessageBack(id, message) {
    console.log(id,message); //debug purposes
    bot.sendMessage(id, message);
}

bot.onText(/\/movie (.+)$/, function (msg, match) {
  var link = match[1];
  link = link.toLowerCase();
  link = link.replace(/[:'`()]/g, "");
		link = link.replace(/-/g, "-");
  link = link.replace(/\s/g, "-");
var dest = link ;
console.log(dest); //debug purposes
 movie_searcher.search_movie(msg, dest, sendMessageBack);
});

bot.onText(/\/tv (.+)$/, function (msg, match) {
  var link = match[1];
  link = link.toLowerCase();
  		link = link.replace(/[:'`()]/g, "");
		link = link.replace(/-/g, "-");
  link = link.replace(/\s/g, "-");
var dest = link ;
console.log(dest); //debug purposes
tvsearcher.search_tvseries(msg, dest, sendMessageBack);
});

bot.onText(/\/game (.+)$/, function (msg, match) {
  var link = match[1];
  link = link.toLowerCase();
  		link = link.replace(/[:'`()&]/g, "");
		link = link.replace(/-/g, "-");
  link = link.replace(/\s/g, "-");
var dest = link ;
console.log(dest); //debug purposes
game_searcher.search_game(msg, dest, sendMessageBack);
});

bot.onText(/\/music (.+)$/, function (msg, match) {
  var link = match[1];
  link = link.toLowerCase();
  		link = link.replace(/[:'`()&]/g, "");
  link = link.replace(/\s/g, "-");
var dest = link ;
console.log(dest); //debug purposes
album_searcher.search_album(msg, dest, sendMessageBack);
});

bot.onText(/\/search (.+)$/, function (msg, match) {
  var link = match[1];
  link = link.toLowerCase();
  		link = link.replace(/[:'`()&]/g, "");
		link = link.replace(/-/g, "-");
  link = link.replace(/\s/g, "-");
var dest = link ;
console.log(dest); //debug purposes
suggestion_searcher.search_suggestions(msg, dest, sendMessageBack);
});

bot.onText(/\/help|\/start/, function (msg, match) {

 var resp = 'Usage mode:\n' + 
            '/movie movie_name: Search for a movie scores in metacritic \n' +
            '/tv series_name/season season_number: Search for a TV series scores in metacritic \n'+
			'/game console_name/game_name: Search for a videogame scores of an especific console in metacritic \n' +
			'/music album/singer_or band: Search for a music album scores of a singer or a band in metacritic \n'+
			'/search [movie|tv|game|album]/[movie_name|series_name|game_name|album_name]: Searches and return a list of suggestions for a entered movie/tv series/game/album query \n';
  
  console.log(msg, resp); //debug purposes
  bot.sendMessage(msg.chat.id, resp);
});

module.exports = bot;
