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
            .text("Hello %s... Thanks for adding me. Say 'hello' to start the conversation", name || 'there');
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

bot.dialog('/', [
    function(session) {
        // Send a greeting and show help.
        var card = new builder.HeroCard(session)
            .title("Foresters Financial - (Preview POC state)")
            .text("Foresters - wherever you are looking for help to support your queries for Foresters Financial")
            .images([
                builder.CardImage.create(session, "https://wnzuuw-sn3301.files.1drv.com/y3mm_WPWW4Py2qRPC0wv1Cvn2ST96Yku7sbHzLYsqlu5IXiqOsjOvtb68WNcBkdxHi7Q3Z569hai0VdlvFf05X9OzMl_fjImgsfd_wkpyp5WQA1KTtDXY_MHrOaBrav4Ptg-lNuSSZNtBRkV6sR93rWnkCVMJE2E1SUCHZFrNH0fOo?width=80&height=80&cropmode=none")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Hi There... I'm Foresters's bot for your Help. I can help you for most of your generic queries. If I am not able to help you, I can collect your query and do a call back for you.");
        session.beginDialog('/help');
    },
    function(session, results) {
        // Display menu
        session.beginDialog('/menu');
    },
    function(session, results) {
        // Always say goodbye
        session.send("Ok... See you later!");
    }
]);

bot.dialog('/menu', [
    function(session) {
        builder.Prompts.choice(session, "What kind of support would you like to go for?", "Payments|Claims|Disbursements|Illustrations|IamAnAgent|Memberbenefits|ContactUS|(quit)");
    },
    function(session, results) {
        if (results.response && results.response.entity != '(quit)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    },
    function(session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/menu');
    }
]).reloadAction('reloadMenu', null, { matches: /^menu|show menu/i });

bot.dialog('/help', [
    function(session) {
        session.endDialog("Global commands that are available anytime:\n\n* menu - Exits a Code Demo and returns to the menu.\n* goodbye - End this conversation.\n* help - Displays these commands.");
    }
]);

bot.dialog('/Payments', [

    function(session) {
        builder.Prompts.choice(session, "How do I?\n Pick an option.", "Change Bank Account|Billing Date|PAC|Get Loan|Claim|CancelPolicy|ContactUs");
    },
    function(session, results) {
        session.send("You chose '%s' Here is the details of your question", results.response.entity);

        var reply;
        var response = results.response.entity;
        switch (response) {
            case 'Change Bank Account':
                reply = "<b>Change Bank Account</b> For changing bank account you have to ......... ";
                break;
            case 'Billing Date':
                reply = "<b>Billing Date</b> For Billing Data Change, ........... ";
                break;
            case 'PAC':
                reply = "<b>PAC</b> For PAC................ .................... ................................ ..................... .,,,,,,,,,,,,,,,,,, ";
                break;
            case 'Get Loan':
                reply = "<b>PAC</b> For PAC................ .................... ................................ ..................... .,,,,,,,,,,,,,,,,,, ";
                break;
            case 'Claim':
                reply = "<b>PAC</b> For Claim................ .................... ................................ ..................... .,,,,,,,,,,,,,,,,,, ";
                break;
            case 'CancelPolicy':
                reply = "<b>PAC</b> For PAC................ .................... ................................ ..................... .,,,,,,,,,,,,,,,,,, ";
                break;
            case 'ContactUs':
                var msg = new builder.Message(session)
                    .textFormat(builder.TextFormat.xml)
                    .attachments([
                        new builder.HeroCard(session)
                        .title("Hero Card")
                        .subtitle("Space Needle")
                        .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                        .images([
                            builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                        ])
                        .buttons([
                            builder.CardAction.dialogAction(session, "weather", "Seattle, WA", "Current Weather")
                        ])
                    ]);
                session.send(msg);

                //reply = "<b>PAC</b> For PAC................ .................... ................................ ..................... .,,,,,,,,,,,,,,,,,, ";
                break;

        }
        session.endDialog(reply);
        // builder.Prompts.confirm(session, "Prompts.confirm()\n\nSimple yes/no questions are possible. Answer yes or no now.");
    },

    function(session, results) {
        session.send("Recognized Entity: %s", JSON.stringify(results.response));
        builder.Prompts.attachment(session, "Prompts.attachment()\n\nYour bot can wait on the user to upload an image or video. Send me an image and I'll send it back to you.");
    },
    function(session, results) {
        var msg = new builder.Message(session)
            .ntext("I got %d attachment.", "I got %d attachments.", results.response.length);
        results.response.forEach(function(attachment) {
            msg.addAttachment(attachment);
        });
        session.endDialog(msg);
    }
]);





bot.dialog('/Claims', [

    function(session) {
        builder.Prompts.choice(session, "Select a Claim Type", "Claim1|Claim2|CancelPolicy");
    },
    function(session, results) {
        session.send("You chose '%s' Here is the details of your question", results.response.entity);

        var reply;
        var response = results.response.entity;
        switch (response) {

            case 'MakeClaim':
                reply = "<b>PAC</b> For Claim................ .................... ................................ ..................... .,,,,,,,,,,,,,,,,,, ";
                break;
            case 'CancelPolicy':
                reply = "<b>PAC</b> For PAC................ .................... ................................ ..................... .,,,,,,,,,,,,,,,,,, ";
                break;

        }
        session.endDialog(reply);
    },


    function(session) {
        session.send("You can easily send pictures to a user...");
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "http://www.theoldrobots.com/images62/Bender-18.JPG"
            }]);
        session.endDialog(msg);
    }
]);

bot.dialog('/cards', [
    function(session) {
        session.send("You can use Hero & Thumbnail cards to send the user visually rich information...");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                .title("Hero Card")
                .subtitle("Space Needle")
                .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                .images([
                    builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                ])
                .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle"))
            ]);
        session.send(msg);

        msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.VideoCard(session)
                .title("Video Card")
                .subtitle("Microsoft Band")
                .text("This is Microsoft Band. For people who want to live healthier and achieve more there is Microsoft Band. Reach your health and fitness goals by tracking your heart rate, exercise, calorie burn, and sleep quality, and be productive with email, text, and calendar alerts on your wrist.")
                .image(builder.CardImage.create(session, "https://tse1.mm.bing.net/th?id=OVP.Vffb32d4de3ecaecb56e16cadca8398bb&w=150&h=84&c=7&rs=1&pid=2.1"))
                .media([
                    builder.CardMedia.create(session, "http://video.ch9.ms/ch9/08e5/6a4338c7-8492-4688-998b-43e164d908e5/thenewmicrosoftband2_mid.mp4")
                ])
                .autoloop(true)
                .autostart(false)
                .shareable(true)
            ]);
        session.send(msg);

        msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.ThumbnailCard(session)
                .title("Thumbnail Card")
                .subtitle("Pikes Place Market")
                .text("<b>Pike Place Market</b> is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
                .images([
                    builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg")
                ])
                .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market"))
            ]);
        session.endDialog(msg);
    }
]);

bot.dialog('/Disbursements', [
    function(session) {
        session.send("You can send the user a list of cards as multiple attachments in a single message...");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                .title("Hero Card")
                .subtitle("Space Needle")
                .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                .images([
                    builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                ]),
                new builder.ThumbnailCard(session)
                .title("Thumbnail Card")
                .subtitle("Pikes Place Market")
                .text("<b>Pike Place Market</b> is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
                .images([
                    builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg")
                ])
            ]);
        session.endDialog(msg);
    }
]);

bot.dialog('/Illustrations', [
    function(session) {
        session.send("You can pass a custom message to Prompts.choice() that will present the user with a carousel of cards to select from. Each card can even support multiple actions.");

        // Ask the user to select an item from a carousel.
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                .title("Space Needle")
                .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                .images([
                    builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                    .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/800px-Seattlenighttimequeenanne.jpg")),
                ])
                .buttons([
                    builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "Wikipedia"),
                    builder.CardAction.imBack(session, "select:100", "Select")
                ]),
                new builder.HeroCard(session)
                .title("Pikes Place Market")
                .text("<b>Pike Place Market</b> is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
                .images([
                    builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg")
                    .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/800px-PikePlaceMarket.jpg")),
                ])
                .buttons([
                    builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market", "Wikipedia"),
                    builder.CardAction.imBack(session, "select:101", "Select")
                ]),
                new builder.HeroCard(session)
                .title("EMP Museum")
                .text("<b>EMP Musem</b> is a leading-edge nonprofit museum, dedicated to the ideas and risk-taking that fuel contemporary popular culture.")
                .images([
                    builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/320px-Night_Exterior_EMP.jpg")
                    .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/800px-Night_Exterior_EMP.jpg"))
                ])
                .buttons([
                    builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/EMP_Museum", "Wikipedia"),
                    builder.CardAction.imBack(session, "select:102", "Select")
                ])
            ]);
        builder.Prompts.choice(session, msg, "select:100|select:101|select:102");
    },
    function(session, results) {
        var action, item;
        var kvPair = results.response.entity.split(':');
        switch (kvPair[0]) {
            case 'select':
                action = 'selected';
                break;
        }
        switch (kvPair[1]) {
            case '100':
                item = "the <b>Space Needle</b>";
                break;
            case '101':
                item = "<b>Pikes Place Market</b>";
                break;
            case '102':
                item = "the <b>EMP Museum</b>";
                break;
        }
        session.endDialog('You %s "%s"', action, item);
    }
]);

bot.dialog('/AgentContact', [
    function(session) {
        session.send("You can send a receipts for purchased good with both images and without...");

        // Send a receipt with images
        var msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                .title("Recipient's Name")
                .items([
                    builder.ReceiptItem.create(session, "$22.00", "EMP Museum").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Night_Exterior_EMP.jpg")),
                    builder.ReceiptItem.create(session, "$22.00", "Space Needle").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/7/7c/Seattlenighttimequeenanne.jpg"))
                ])
                .facts([
                    builder.Fact.create(session, "1234567898", "Order Number"),
                    builder.Fact.create(session, "VISA 4076", "Payment Method"),
                    builder.Fact.create(session, "WILLCALL", "Delivery Method")
                ])
                .tax("$4.40")
                .total("$48.40")
            ]);
        session.send(msg);

        // Send a receipt without images
        msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                .title("Recipient's Name")
                .items([
                    builder.ReceiptItem.create(session, "$22.00", "EMP Museum"),
                    builder.ReceiptItem.create(session, "$22.00", "Space Needle")
                ])
                .facts([
                    builder.Fact.create(session, "1234567898", "Order Number"),
                    builder.Fact.create(session, "VISA 4076", "Payment Method"),
                    builder.Fact.create(session, "WILLCALL", "Delivery Method")
                ])
                .tax("$4.40")
                .total("$48.40")
            ]);
        session.endDialog(msg);
    }
]);

bot.dialog('/signin', [
    function(session) {
        // Send a signin 
        var msg = new builder.Message(session)
            .attachments([
                new builder.SigninCard(session)
                .text("You must first signin to your account.")
                .button("signin", "http://example.com/")
            ]);
        session.endDialog(msg);
    }
]);


bot.dialog('/actions', [
    function(session) {
        session.send("Bots can register global actions, like the 'help' & 'goodbye' actions, that can respond to user input at any time. You can even bind actions to buttons on a card.");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                .title("Hero Card")
                .subtitle("Space Needle")
                .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                .images([
                    builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                ])
                .buttons([
                    builder.CardAction.dialogAction(session, "weather", "Seattle, WA", "Current Weather")
                ])
            ]);
        session.send(msg);

        session.endDialog("The 'Current Weather' button on the card above can be pressed at any time regardless of where the user is in the conversation with the bot. The bot can even show the weather after the conversation has ended.");
    }
]);

// Create a dialog and bind it to a global action
bot.dialog('/ConnectToForesters', [
    function(session, args) {
        session.endDialog("Thank you to contact Foresters Financial in %s is 71 degrees and raining.", args.data);
    }
]);
bot.beginDialogAction('weather', '/weather'); // <-- no 'matches' option means this can only be triggered by a button.




/*

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
/*
    }
]);
*/
/*
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
        session.endDialogWithResult({
            response: session.dialogData.profile
        });
    }
]);
*/