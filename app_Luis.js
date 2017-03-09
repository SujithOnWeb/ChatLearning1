var restify = require('restify');
var builder = require('botbuilder');
//var builder = require('../../core/');
var http = require('http');

var appInsights = require("applicationinsights");
appInsights.setup("7df6208e-d791-401d-aea0-5a04439433e8").start();

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot

//var connector = new builder.ConsoleConnector().listen();
var connector = new builder.ChatConnector({
    appId: "8567d85d-df78-4db2-9de5-b4a175c0df21",
    appPassword: "6vZN3HG88nWPjTzicX9VEZN"
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

//=========================================================
// Activity Events
//=========================================================

bot.on('conversationUpdate', function(message) {
    // Check for group conversations
    if (message.address.conversation.isGroup) {
        // Send a hello message when bot is added
        if (message.membersAdded) {
            message.membersAdded.forEach(function(identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                        .address(message.address)
                        .text("Hello everyone!");
                    bot.send(reply);
                }
            });
        }

        // Send a goodbye message when bot is removed
        if (message.membersRemoved) {
            message.membersRemoved.forEach(function(identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                        .address(message.address)
                        .text("Goodbye");
                    bot.send(reply);
                }
            });
        }
    }
});

bot.on('contactRelationUpdate', function(message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
            .address(message.address)
            .text("Hello %s... Thanks for adding me. I am not very chatty (I won’t answer things like “How are you?”) but I does handle most of your enquiries. Opening up a chat window with me even brings up the most common help issues to make the process even more convenient. Say 'hello' to start the conversation", name || 'there');
        bot.send(reply);
    } else {
        // delete their data
    }
});

bot.on('deleteUserData', function(message) {
    // User asked to delete their data
});


//=========================================================
// Bots Middleware
//=========================================================

// Anytime the major version is incremented any existing conversations will be restarted.
bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));

//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });

bot.beginDialogAction('help', '/help', { matches: /^help/i });
//=========================================================
// Bots Dialogs
//=========================================================

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.

//var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
//bot.dialog('/', dialog);

//var model='https://api.projectoxford.ai/luis/v2.0/apps/4627c97e-a07b-4f56-be78-8e800a494ba5?subscription-key=2cc8dc44dd904d23801377c78f22c13b&verbose=true"
////var model = 'https://luis-actions.cloudapp.net/api/v1/botframework?app-id=4627c97e-a07b-4f56-be78-8e800a494ba5&subscription-key=2cc8dc44dd904d23801377c78f22c13b';
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4627c97e-a07b-4f56-be78-8e800a494ba5?subscription-key=2cc8dc44dd904d23801377c78f22c13b&verbose=true';
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);
// Add intent handlers
intents.matches('Payments', [

    // try extracting entities
    function(session, args, next) {
        session.send('We will help your payment related queries!');
        var certEntity = builder.EntityRecognizer.findEntity(args.entities, 'Call Back Me');
        // var claimEntity = builder.EntityRecognizer.findEntity(args.entities, 'claim');
        session.send(certEntity + 'Hi');


        if (certEntity) {
            // city entity detected, continue to next step
            session.dialogData.searchType = 'city';
            builder.Prompts.text(session, 'Please enter certificate No');
            next({ response: cityEntity.entity });
        } else if (certEntity) {
            // airport entity detected, continue to next step
            session.dialogData.searchType = 'airport';
            builder.Prompts.text(session, 'Please enter Call Back No?');
            next({ response: airportEntity.entity });
        } else {
            builder.Prompts.text(session, 'Please enter your destination' + args.entities[0].entity + ' ' + args.entity[0].type + args.entities[1].entity);
        }
    },


]);


/*

builder.DialogAction.send('Creating Alarm'));
intents.matches('Certificate', builder.DialogAction.send('Deleting Alarm'));
var cityEntity = builder.EntityRecognizer.findEntity(intents.entities, 'builtin.geography.city');
var airportEntity = builder.EntityRecognizer.findEntity(intents.entities, 'AirportCode');
*/

//dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. I can only create & delete alarms."));
/*
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);
console.log([intents]);
intents.matches('ListItems', [
    function(session, args, next) {
        var task = builder.EntityRecognizer.findEntity(args.entities, 'Certificate');
        if (!task) {
            builder.Prompts.text(session, "What would you like to call the task?");
        } else {
            next({ response: task.entity });
        }
    },
    function(session, results) {
        if (results.response) {
            // ... save task
            session.send("Ok... Added the '%s' task.", results.response);
        } else {
            session.send("Ok");
        }
    }
]);

intents.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. I can only create & delete alarms."));

*/