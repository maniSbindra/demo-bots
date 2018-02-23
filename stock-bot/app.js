// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
// var Store = (require'./store');
// var spellService = require('./spell-service');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL || "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/119117d4-f82e-452d-affa-4a46e14fca5e?subscription-key=991d4cb641074f1c9ee22663d11e5db9&verbose=true&timezoneOffset=0&q=");
bot.recognizer(recognizer);

bot.dialog('GetStockPrice', [
    function (session, args, next) {
        // var stockCodeEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'stockcode');
        var stockCodeEntity = args.intent.entities[0].entity;

        if(stockCodeEntity)
        {
        session.send('Hi You want to find the stock price of stock code: \'%s\'', stockCodeEntity);
        }
    }
]).triggerAction({
    matches: 'GetStockPrice',
    onInterrupted: function (session) {
        session.send('Please provide a stock code');
    }
});

bot.dialog('GetStockTrend', function (session, args) {
    // var stockCodeEntity = builder.EntityRecognizer.findEntity(args.intent.entities[0].entity, 'stockcode');
    var stockCodeEntity = args.intent.entities[0].entity;
        if(stockCodeEntity)
        {
        session.send('Hi You want to find the trend of stock code: \'%s\'', stockCodeEntity);
        }

}).triggerAction({
    matches: 'GetStockTrend'
});

bot.dialog('Greeting', function (session) {
    session.endDialog('Hi! Try asking me about price of stock providing the stock code. You can also ask me about the stock trends');
}).triggerAction({
    matches: 'Greeting'
});

// // Spell Check
// if (process.env.IS_SPELL_CORRECTION_ENABLED === 'true') {
//     bot.use({
//         botbuilder: function (session, next) {
//             spellService
//                 .getCorrectedText(session.message.text)
//                 .then(function (text) {
//                     console.log('Text corrected to "' + text + '"');
//                     session.message.text = text;
//                     next();
//                 })
//                 .catch(function (error) {
//                     console.error(error);
//                     next();
//                 });
//         }
//     });
// }

// // Helpers
// function hotelAsAttachment(hotel) {
//     return new builder.HeroCard()
//         .title(hotel.name)
//         .subtitle('%d stars. %d reviews. From $%d per night.', hotel.rating, hotel.numberOfReviews, hotel.priceStarting)
//         .images([new builder.CardImage().url(hotel.image)])
//         .buttons([
//             new builder.CardAction()
//                 .title('More details')
//                 .type('openUrl')
//                 .value('https://www.bing.com/search?q=hotels+in+' + encodeURIComponent(hotel.location))
//         ]);
// }

// function reviewAsAttachment(review) {
//     return new builder.ThumbnailCard()
//         .title(review.title)
//         .text(review.text)
//         .images([new builder.CardImage().url(review.image)]);
// }