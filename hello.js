var builder = require('botbuilder');
var restify = require('restify');
var server = restify.createServer();
server.listen(9988, function() {
    console.log('%s listening to %s', server.name, server.url);
});

//create the connector  
//var connector = new builder.ConsoleConnector().listen();
var connector = new builder.ChatConnector({
    appId: "1234567", //process.env.MICROSOFT_APP_ID,
    appPassword: "1234567" //process.env.MICROSOFT_APP_PASSWORD
});
//var connector = new builder.ChatConnector();
//Create the bot
var bot = new builder.UniversalBot(connector);
/*bot.dialog('/', function (session) {
    //session.send('Hello, Bot')
    session.send('Hello, There. What is Your name');
    var userMsg = session.message.text;
    session.send('Hello' + userMsg);

});*/
/*
bot.dialog('/', [function(session) {
        builder.Prompts.text(session, "Please enter your name")
    },
    function(session, result) {
        session.send('HEy ' + result.response);
    }


]);*/
/*
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

server.post('api/messages', connector.listen());*/
bot.dialog('/', [
    function(session) {
        session.beginDialog('/ensureProfile', session.userData.profile);
    },
    function(session, results) {

        session.userData.profile = results.response;
        session.send('Hi ' + session.userData.profile.name + ' ' + session.userData.profile.company + ' ' + session.userData.profile.State);
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
            builder.Prompts.text(session, 'What is you company name?');
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
            builder.Prompts.choice(session, 'What is your State?', states);
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