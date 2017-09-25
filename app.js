var restify = require('restify');
var builder = require('botbuilder');
//var builder = require('../../core/');
var http = require('http');

//var appInsights = require("applicationinsights");
//appInsights.setup("7df6208e-d791-401d-aea0-5a04439433e8").start();

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

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^bye/i });

bot.beginDialogAction('help', '/help', { matches: /^help/i });
//=========================================================
// Bots Dialogs
//=========================================================

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.

//var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
//bot.dialog('/', dialog);

/*

var model = 'https://luis-actions.cloudapp.net/api/v1/botframework?app-id=4627c97e-a07b-4f56-be78-8e800a494ba5&subscription-key=007a6e10499e4a139dd04a590b2fda3a&q=i am looking for a policy';



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

bot.dialog('/', [
    function(session) {
        // Send a greeting and show help.
        var card = new builder.HeroCard(session)
            .title("Foresters Financial - (Preview POC state)")
            //.text("Foresters - wherever you are looking for help to support your queries for Foresters Financial")
            .images([

                //builder.CardImage.create(session, "https://wnzuuw-sn3301.files.1drv.com/y3mm_WPWW4Py2qRPC0wv1Cvn2ST96Yku7sbHzLYsqlu5IXiqOsjOvtb68WNcBkdxHi7Q3Z569hai0VdlvFf05X9OzMl_fjImgsfd_wkpyp5WQA1KTtDXY_MHrOaBrav4Ptg-lNuSSZNtBRkV6sR93rWnkCVMJE2E1SUCHZFrNH0fOo?width=80&height=80&cropmode=none")
                builder.CardImage.create(session, "https://utzruw-sn3301.files.1drv.com/y3myLwt7w949dV02jsAzwAcVs6RgWgYIGdTWV27oCuP8VxX_-7RccS5OsTJBXRw5C0oWGp7qa7Ad9R4XJWRwP8VDqz4GgThRoJDYgrTr_sQVysrJJHNPIhK3Ej0MO53m0YQPEtuwfycvCJPY4eQs40vDipdBM9EF8Ly7sRueCaN-yQ?width=800&height=419&cropmode=none")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Hi There... I'm POC Foresters's bot for your Help. I can help you for most of your generic queries. If I am not able to help you, I can collect your query and do a call back for you.");
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
    //function(session) {
    //  builder.Prompts.choice(session, "What kind of support would you like to go for?", "Payments|Claims|Disbursements|Illustrations|IamAnAgent|Memberbenefits|ContactUS|(quit)");
    // },

    function(session) {
        //session.send("You can pass a custom message to Prompts.choice() that will present the user with a carousel of cards to select from. Each card can even support multiple actions.");

        // Ask the user to select an item from a carousel.
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                // .text("Payment Related Queries")
                .images([
                    // builder.CardImage.create(session, "https://v9zyuw-sn3301.files.1drv.com/y3mE7EmeBZ6Ta_R5dierdYdLp5BtEEn5SB49lTROsZxsQBBS_wTggS2VpQgS1xQZyI86MC52a69zlJV-9pjrRDi3XImLTl84T_1v09Bk7dkyR9j2RccmdfjD-qTIoL3v-doPYkLBnP5qldaYR1lB7z6Oc5zEB78DPBTzrYsRvvMIFg?width=89&height=94&cropmode=none")
                    builder.CardImage.create(session, "https://biotvw.dm2301.livefilestore.com/y4mF-CrdFU674Vm5V_MybFiK6H4GXUNipQwYqoTUc0Ne0PVCNtAt_4fNN_bMYwBCzBFZn6F5ZbtJJq6eqdQXWw4QiSDZmcPiIsqSkTpphYotJVjkgnN8c0_nEg-ziaC9cbc0zrPoKLEX2_kjL_Yh9BCGQ_tOj1Ds9qgavCAdu_QIo8pGTNn9r_d2fqyKPPQ5A9jOq5VysNv5rvcNCmgnCFYzA?width=233&height=216&cropmode=none")
                    .tap(builder.CardAction.showImage(session, "https://biotvw.dm2301.livefilestore.com/y4mF-CrdFU674Vm5V_MybFiK6H4GXUNipQwYqoTUc0Ne0PVCNtAt_4fNN_bMYwBCzBFZn6F5ZbtJJq6eqdQXWw4QiSDZmcPiIsqSkTpphYotJVjkgnN8c0_nEg-ziaC9cbc0zrPoKLEX2_kjL_Yh9BCGQ_tOj1Ds9qgavCAdu_QIo8pGTNn9r_d2fqyKPPQ5A9jOq5VysNv5rvcNCmgnCFYzA?width=233&height=216&cropmode=none")),
                ])
                .buttons([
                    // builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "Wikipedia"),
                    builder.CardAction.imBack(session, "Payments", "Select")
                ]),
                new builder.HeroCard(session)
                //.text("Claims related Queries")
                .images([
                    builder.CardImage.create(session, "https://bin3bg.dm2301.livefilestore.com/y4mcC6GzrMTjOakZRd39ovKHUgJv8fOzV_2z9xmYRg4nb9RubvsYK4MMc7LKE3sOGw3aIlGQEqCV09DddTgxYEPQdPvjKyo6lB7QpBgBBERdxzqIm_2OnLphOPGz-oVwRFI7Ey8AMI1_mXH19EKoF8JSV4oaO2d0yLI7sN_iZGwF1pxRvjqvQSIcJ8pmEbdV_ONsx2N0QqqPixW1v2JbK-I5Q?width=800&height=600&cropmode=none")
                    .tap(builder.CardAction.showImage(session, "https://bin3bg.dm2301.livefilestore.com/y4mcC6GzrMTjOakZRd39ovKHUgJv8fOzV_2z9xmYRg4nb9RubvsYK4MMc7LKE3sOGw3aIlGQEqCV09DddTgxYEPQdPvjKyo6lB7QpBgBBERdxzqIm_2OnLphOPGz-oVwRFI7Ey8AMI1_mXH19EKoF8JSV4oaO2d0yLI7sN_iZGwF1pxRvjqvQSIcJ8pmEbdV_ONsx2N0QqqPixW1v2JbK-I5Q?width=800&height=600&cropmode=none")),
                ])
                .buttons([
                    // builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market", "Wikipedia"),
                    builder.CardAction.imBack(session, "Claims", "Select")
                ]),
                new builder.HeroCard(session)
                // .title("Foresters Financial")
                // .text("PO Box 179 Buffalo, NY 14201 Toll-Free Fax: 877 329 4631 \n Email:service@foresters.com")
                .images([
                    builder.CardImage.create(session, "https://bipcpq.dm2301.livefilestore.com/y4mC27fTwS9dovWIqGguSmxsEYwMsdcq7mtjgkIk17fWCwlTNpiIQXSSTcbdGGpcEZ0NgMdar75gd_LJJYNjqTBEA59KH_wP9VEVVo9bB3rsK8Q6OsqGf3hlJrQeGqsUzQcc6qZgpD9drkWuFFz0tj5o_LKi8w4cF15BqRTqwmilzLnhhNINDR00k5RyF47gdSfcnzCmIgX2tXM6SkDCXYb4w?width=800&height=600&cropmode=none")
                    .tap(builder.CardAction.showImage(session, "https://bipcpq.dm2301.livefilestore.com/y4mC27fTwS9dovWIqGguSmxsEYwMsdcq7mtjgkIk17fWCwlTNpiIQXSSTcbdGGpcEZ0NgMdar75gd_LJJYNjqTBEA59KH_wP9VEVVo9bB3rsK8Q6OsqGf3hlJrQeGqsUzQcc6qZgpD9drkWuFFz0tj5o_LKi8w4cF15BqRTqwmilzLnhhNINDR00k5RyF47gdSfcnzCmIgX2tXM6SkDCXYb4w?width=800&height=600&cropmode=none")),
                ])
                .buttons([
                    builder.CardAction.openUrl(session, "http://foresters.com", "Foresters.com"),
                    builder.CardAction.imBack(session, "ContactUs", "More Details")
                ]),
                new builder.HeroCard(session)
                //.text("Other")
                .images([
                    // builder.CardImage.create(session, "https://v9zyuw-sn3301.files.1drv.com/y3mE7EmeBZ6Ta_R5dierdYdLp5BtEEn5SB49lTROsZxsQBBS_wTggS2VpQgS1xQZyI86MC52a69zlJV-9pjrRDi3XImLTl84T_1v09Bk7dkyR9j2RccmdfjD-qTIoL3v-doPYkLBnP5qldaYR1lB7z6Oc5zEB78DPBTzrYsRvvMIFg?width=89&height=94&cropmode=none")
                    builder.CardImage.create(session, "https://utznuw-sn3301.files.1drv.com/y3mckX6xNf8nWT7uZibn7AbkB13TBwIFnO0-uQcYA3ToJxss7Pdx74RPxMIXs5ybMvmwC-MpRmnJsCWkFmoVcMVgcT8SB-bzjHYj-hqW1G0i_-UpZEHN8SXcIlVYTV7Zr1J-heGgsEK-N7vfpFoH8id6Te7cpf7_G4NTQ2ukgtEZ4Q?width=185&height=128&cropmode=none")
                    .tap(builder.CardAction.showImage(session, "https://utznuw-sn3301.files.1drv.com/y3mckX6xNf8nWT7uZibn7AbkB13TBwIFnO0-uQcYA3ToJxss7Pdx74RPxMIXs5ybMvmwC-MpRmnJsCWkFmoVcMVgcT8SB-bzjHYj-hqW1G0i_-UpZEHN8SXcIlVYTV7Zr1J-heGgsEK-N7vfpFoH8id6Te7cpf7_G4NTQ2ukgtEZ4Q?width=185&height=128&cropmode=none")),
                ])
                .buttons([
                    // builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "Wikipedia"),
                    builder.CardAction.imBack(session, "Other", "Select")
                ]),
                new builder.HeroCard(session)
                .images([
                    builder.CardImage.create(session, "https://bims4w.dm2301.livefilestore.com/y4mopUXbkRiNqKXw_gg-C3UjEzI9DK2rM-0Hd0t8d0mMDozvP3T9i8fWPHvwZzrzIwlXJrVw9RWDAQcX8JV20nPpxh-wVWYrpwwvz0ilj25Xk5qfKWCkxkMOQFvTAyvi2YXJ108wLsM8J4_C_ff6UR_tY43TrxSqILjR73kVvRF4KsVYV1fYF27GV2Z_gliWoe3aXu6CV82NBWqtJp8QO4pTQ?width=268&height=198&cropmode=none")
                    .tap(builder.CardAction.showImage(session, "https://bims4w.dm2301.livefilestore.com/y4mopUXbkRiNqKXw_gg-C3UjEzI9DK2rM-0Hd0t8d0mMDozvP3T9i8fWPHvwZzrzIwlXJrVw9RWDAQcX8JV20nPpxh-wVWYrpwwvz0ilj25Xk5qfKWCkxkMOQFvTAyvi2YXJ108wLsM8J4_C_ff6UR_tY43TrxSqILjR73kVvRF4KsVYV1fYF27GV2Z_gliWoe3aXu6CV82NBWqtJp8QO4pTQ?width=268&height=198&cropmode=none"))
                ])
                .buttons([
                    builder.CardAction.imBack(session, "Quit", "Quit")
                ])
            ]);
        builder.Prompts.choice(session, msg, "Payments|Claims|ContactUs|AiSample|Quit");
    },

    function(session, results) {
        if (results.response && results.response.entity != 'Quit') {
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
        builder.Prompts.choice(session, "How do I?", "Change Bank Account|Billing Date|PAC|Get Loan|Call Back Me");
    },
    function(session, results, next1) {
        //session.send("You chose '%s'", results.response.entity);

        var reply;
        var response = results.response.entity;
        switch (response) {
            case 'Change Bank Account':

                reply1 = "Change Bank Account: To change your banking information, mail or fax a letter along with preautherized checking(PAC) to Foresters Financial";
                session.send(reply1);
                session.sendTyping();



                break;
            case 'Billing Date':
                reply = "Billing Date: For Billing Data Change, ........... ";
                break;
            case 'PAC':
                reply = "PAC For PAC................ .................... ................................ ..................... .,,,,,,,,,,,,,,,,,, ";
                break;
            case 'Get Loan':
                reply = "Loan: For Loan................ .................... ................................ ..................... .,,,,,,,,,,,,,,,,,, ";
                break;
            case 'Claim':
                reply = "Claim: For Claim................ .................... ................................ ..................... .,,,,,,,,,,,,,,,,,, ";
                break;
            case 'CancelPolicy':
                reply = "Cancel Policy: For canceling the policy............... .................... ................................ ..................... .,,,,,,,,,,,,,,,,,, ";
                break;

            case 'Call Back Me':
                session.beginDialog('/GetCallBackInfo');
                break;

        }
        session.send(reply);

        switch (response) {
            case 'Change Bank Account':
                session.beginDialog('/BankingAddressChange');
                break;

        }


        next1();
        // "You chose '%s' Here is the details of your question", results.response.entity);
        // builder.Prompts.confirm(session, "Prompts.confirm()\n\nSimple yes/no questions are possible. Answer yes or no now.");
    },
    function(session, results, next1) {
        builder.Prompts.choice(session, "Are you looking any more information from me?", "Yes|No");
    },
    function(session, results) {
        var response = results.response.entity;
        switch (response) {
            case 'Yes':
                session.endDialog("Please select a option");
                break;

            case 'No':
                session.endConversation('Thank you for Contacting us. Have a great Day!')
                break;
        }
        //session.endDialog(reply);
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

/* Payment related Queries */
bot.dialog('/BankingAddressChange', [

    function(session) {
        builder.Prompts.choice(session, "Here is the form <a href='http://www.foresters.com/-/media/foresters/documents/pdfs/us/customer-care/foresters-financial/fliac-insurance/address-change.pdf?la=en'>Address Change Request Form</a>", "Yes|No");
    },

    function(session, results) {
        if (results.response) {
            var res = results.response.entity;
            switch (res) {
                case "Yes":
                    session.send("If you are looking for any help to fill the form, you can get it fro here <a href='http://www.foresters.com/-/media/foresters/documents/pdfs/us/customer-care/foresters-financial/fliac-insurance/address-change-form-instructions.pdf?la=en'>Form Instructions</a>");
                    session.endDialog();
                    break;

                case "No":
                    session.beginDialog('/BACFormFill');
                    break;
            }

        }

    }
]);
bot.dialog('/BACFormFill', [

    function(session) {
        builder.Prompts.choice(session, "Do you want us to send this form as a mail to your mailing address?", "Yes|No");
    },
    function(session, results) {
        if (results.response) {
            var res = results.response.entity;
            switch (res) {
                case "Yes":
                    session.send("Ok We will send it within 2 working days");
                    session.send("By the way, if you would like to update your mailing adress you can do it through our call center");
                    break;
                case "No":
                    session.send("Ok");
                    break;
            }
        }
        session.endDialog();
    }
]);

/* Payment related Queries */


bot.dialog('/Claims', [

    function(session) {
        builder.Prompts.choice(session, "Select a Claim Type", "MakeClaim|CancelPolicy|Call Back Me");
    },
    function(session, results, next2) {
        session.send("You chose '%s'", results.response.entity);

        var reply;
        var response = results.response.entity;
        switch (response) {

            case 'MakeClaim':
                reply = "<b>PAC</b> For Claim................ .................... ................................ ..................... .,,,,,,,,,,,,,,,,,, ";
                break;
            case 'CancelPolicy':
                reply = "<b>PAC</b> For PAC................ .................... ................................ ..................... .,,,,,,,,,,,,,,,,,, ";
                break;
            case 'Call Back Me':
                session.beginDialog('/GetCallBackInfo');
                break;

        }
        session.send(reply);
        next2();
    },
    function(session, results, next2) {
        builder.Prompts.choice(session, "Are you looking any more information from me?", "Yes|No");
        //next();
    },
    function(session, results) {

        var response = results.response.entity;
        switch (response) {
            case 'Yes':
                session.endDialog("Please select a option");
                break;
            case 'No':
                session.replaceDialog('/Quit');
                break;
        }
        //session.endDialog(reply);
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
        //session.send("You can pass a custom message to Prompts.choice() that will present the user with a carousel of cards to select from. Each card can even support multiple actions.");

        // Ask the user to select an item from a carousel.
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                .title("Payments")
                .text("Payment Related Queries")
                .images([
                    builder.CardImage.create(session, "https://v9zyuw-sn3301.files.1drv.com/y3mE7EmeBZ6Ta_R5dierdYdLp5BtEEn5SB49lTROsZxsQBBS_wTggS2VpQgS1xQZyI86MC52a69zlJV-9pjrRDi3XImLTl84T_1v09Bk7dkyR9j2RccmdfjD-qTIoL3v-doPYkLBnP5qldaYR1lB7z6Oc5zEB78DPBTzrYsRvvMIFg?width=89&height=94&cropmode=none")
                    .tap(builder.CardAction.showImage(session, "https://v9zyuw-sn3301.files.1drv.com/y3mE7EmeBZ6Ta_R5dierdYdLp5BtEEn5SB49lTROsZxsQBBS_wTggS2VpQgS1xQZyI86MC52a69zlJV-9pjrRDi3XImLTl84T_1v09Bk7dkyR9j2RccmdfjD-qTIoL3v-doPYkLBnP5qldaYR1lB7z6Oc5zEB78DPBTzrYsRvvMIFg?width=89&height=94&cropmode=none")),
                ])
                .buttons([
                    // builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "Wikipedia"),
                    builder.CardAction.imBack(session, "Payments", "Select")
                ]),
                new builder.HeroCard(session)
                .title("Claims")
                .text("<b>Claims</b> Claims related Queries")
                .images([
                    builder.CardImage.create(session, "https://v9zvuw-sn3301.files.1drv.com/y3mFgbroj_cV5AEPfvuHLoOpO5cCYDKAndBUn1h14vmI27i1d82fAoPGfuY6MjZSQlUXsVtXOrK28KLAJGw29vAWfc9yoANebp7yhID-K4nqtPgFTIuyD6FhRlmPww5yIy7oLKSxzTYWWssYlNYgase8EdeHILveI9Ywi9ZKG7nqy4?width=98&height=91&cropmode=none")
                    .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/800px-PikePlaceMarket.jpg")),
                ])
                .buttons([
                    // builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market", "Wikipedia"),
                    builder.CardAction.imBack(session, "Claims", "Select")
                ]),
                new builder.HeroCard(session)
                .title("Contact Us")
                .text("<b>Pike Place Market</b> is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
                .images([
                    builder.CardImage.create(session, "https://wnzouw-sn3301.files.1drv.com/y3mT9AqmAqeXgSkNUaIOlFgkq9_fJ-c654C172n1AwUWeQfzdMmcLBP-JOtHLmrJaQCPTtBKNuyIsvPinxzJJxMG1NBpTgneKn-Ej4gAgGb4JMwaf1va2S1sozEKXZ-A9pQW-_pP4KW17_SKmxFwkTF_bK9VN_kgN1wk_vE7Zox9dg?width=94&height=94&cropmode=none")
                    .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/800px-PikePlaceMarket.jpg")),
                ])
                .buttons([
                    builder.CardAction.openUrl(session, "http://foresters.com", "Foresters.com"),
                    builder.CardAction.imBack(session, "ContactUS", "Select")
                ]),
                new builder.HeroCard(session)
                .title("EMP Museum")
                .text("<b>EMP Musem</b> is a leading-edge nonprofit museum, dedicated to the ideas and risk-taking that fuel contemporary popular culture.")
                .images([
                    builder.CardImage.create(session, "https://wnznuw-sn3301.files.1drv.com/y3mjUlQnXj3KQZo2Uu42sv6mcs3fkudi9TBj_FTnAETyFxma9SiVjROj5Vqqpqk7bcP2iUZnUK-_RR_VcKl-QRo0CNFKqoMJBXOHo7yW6z5Ui-z_szdnyFkcHmW3OHKb2iRv0zgUWyR3Z1J4l8W2v0Xv1rCyKsTkFT4SQiD0TBh--o?width=94&height=94&cropmode=none")
                    .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/800px-Night_Exterior_EMP.jpg"))
                ])
                .buttons([
                    builder.CardAction.imBack(session, "select:102", "Select")
                ])
            ]);
        builder.Prompts.choice(session, msg, "select:100|select:101|select:102");
    },
    function(session, results) {
        var action, item;
        var kvPair = results.response.entity.split(':');

        switch (kvPair) {
            case 'Payments':
                item = "the <b>Payments</b>";
                break;
            case 'Claims':
                item = "<b>Claims</b>";
                break;
            case 'ContactUs':
                item = "ContactUs";
                break;
            case 'Quit':
                item = "Quit";
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





bot.dialog('/GetCallBackInfo', [
    function(session) {
        //session.send("Hello There,");
        session.beginDialog('/ensureProfile', session.userData.profile);
    },
    function(session, results) {

        session.userData.profile = results.response;


        var options = {
            host: 'servicetocrmbro.azurewebsites.net',
            //port: 80,
            path: '/api/CRM/' + session.userData.profile.name1,
            method: 'Get'
        };

        http.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function(chunk) {

                session.endConversation('Hi ' + session.userData.profile.name1 +
                    ' Thanks for your information. we have recorded your message in our system. One of our representative will call you back soon to serve you. Here is you referance no:' + chunk
                );

                console.log('BODY: ' + chunk);
            });
        }).end();

        session.endConversation("Request is Processing... Please wait...");

        /*
        var thumbnail = new builder.ThumbnailCard(session);
        thumbnail.title = session.userData.name;
        thumbnail.subtitle = session.userData.company;
        thumbnail.text = session.userData.State.entity;*/


    }
]);

bot.dialog('/ensureProfile', [
    function(session, args, next) {
        session.dialogData.profile = args || {};

        if (session.dialogData.profile.name1 === undefined || session.dialogData.profile.name1 === null) {
            builder.Prompts.text(session, 'Please provide Below Informations....');
        } else {
            next();
        }
    },
    function(session, results, next) {

        if (session.dialogData.profile.name1 === undefined || session.dialogData.profile.name1 === null) {
            builder.Prompts.text(session, 'What is your Name?');
        } else {
            next();
        }
    },
    function(session, results, next) {
        if (results.response) {
            session.dialogData.profile.name1 = results.response;
        }
        if (session.dialogData.profile.CertificateNo === undefined || session.dialogData.profile.CertificateNo === null) {
            builder.Prompts.text(session, 'What is your Certificate Number?');
        } else {
            next();
        }

    },
    function(session, results, next) {
        if (results.response) {
            session.dialogData.profile.CertificateNo = results.response;

        }
        if (session.dialogData.profile.PhoneNumber === undefined || session.dialogData.profile.PhoneNumber === null) {
            builder.Prompts.text(session, 'Please share your contact number to call you back?');
        } else {
            // builder.send(session, 'We will contact you on %s', session.dialogData.profile.PhoneNumber);
            next();
        }
        //session.endDialogWithResult({ response: session.dialogData.profile });

    },
    function(session, results, next) {
        if (results.response) {
            session.dialogData.profile.PhoneNumber = results.response;
            // session.dialogData.profile.Query = null;
        }
        if (session.dialogData.profile.Query === undefined || session.dialogData.profile.Query === null) {
            builder.Prompts.text(session, 'Please share your Query which will help us to serve you better');

        } else {
            //  session.dialogData.profile.Query = null;
            //builder.Prompts.text(session, 'Please share your Query which will help us to serve you better');
            next();
        }
        //session.endDialogWithResult({ response: session.dialogData.profile });

    },
    function(session, results) {
        if (results.response) {
            session.dialogData.profile.Query = results.response;
        }
        session.endDialogWithResult({
            response: session.dialogData.profile
        });
    }
]);