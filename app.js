var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
/*
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});*/
var connector = new builder.ChatConnector({
    appId: "8567d85d-df78-4db2-9de5-b4a175c0df21",
    appPassword: "6vZN3HG88nWPjTzicX9VEZN"
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================


bot.dialog('/', [
    function(session) {
        session.send("Hello There,");
        session.beginDialog('/ensureProfile', session.userData.profile);
    },
    function(session, results) {

        session.userData.profile = results.response;
        session.send('Hi ' + session.userData.profile.name +
            ' Thanks for your information. we are processing your request and contact you soon.'
        );
        /* var thumbnail=new builder.ThumbnailCard(session);
        thumbnail.title=session.userData.name;
        thumbnail.subtitle=session.userData.company;
        thumbnail.text=session.userData.State.entity;
        thumbnail.ta*/

    }
]);


bot.dialog('/ensureProfile', [
    function(session, args, next) {
        session.dialogData.profile = args || {};

        if (session.dialogData.profile.name === undefined || session.dialogData.profile.name === null) {
            builder.Prompts.text(session, 'What is your Name?');

        } else {
            next();
        }
    },
    function(session, results, next) {
        if (results.response) {
            session.dialogData.profile.name = results.response;
        }
        if (session.dialogData.profile.company === undefined || session.dialogData.profile.company === null) {
            builder.Prompts.text(session, 'What is you Cert no?');
        } else {
            next();
        }

    },
    function(session, results, next) {
        if (results.response) {
            session.dialogData.profile.company = results.response;

        }
        if (session.dialogData.profile.State === undefined || session.dialogData.profile.State === null) {
            var states = ['A', 'B', 'C', 'D', 'E'];
            builder.Prompts.choice(session, 'What kind of support are you looking from me?', states);
        } else {
            next();
        }
        //session.endDialogWithResult({ response: session.dialogData.profile });

    },
    function(session, results) {
        if (results.response) {
            session.dialogData.profile.State = results.response;
        }
        session.endDialogWithResult({ response: session.dialogData.profile });
    }
]);