import Botkit from 'botkit'
import request from 'request';
import {RequestZip} from '../models/request.model'
import {Attachment} from '../models/atachment.model'
import {LocalStorage} from "../../config/localstorage"

let localstorage = new LocalStorage();

let controller = Botkit.facebookbot({
    debug: false,
    access_token: process.env.FACEBOOK_PAGE_TOKEN,
    verify_token: process.env.FACEBOOK_VERIFY_TOKEN
});

let bot = controller.spawn({});

//--------------Cash a very large content that fix a unstable of speed----------------------

let startPostback = new Attachment('Lunch on your time', 'Subtitle text', 'http://www.zdorovieinfo.ru/upload/images/slides/490x330_%D0%95%D0%B4%D0%B0_%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%B0%D1%8F-%D1%83%D0%B1%D0%B8%D0%B2%D0%B0%D0%B5%D1%82_5.jpg')
    .postback(1, ['Order Now'], ['starting']);

let sliderOfRests = new Attachment().slider(3, 3,
    ["Chaya Brasserie - French, Japanese", "Chaya Brasserie - French, Japanese", "Chaya Brasserie - French, Japanese"],
    ['Subtitle for restaran', 'Subtitle for restaurant', 'Subtitle for restaurant'],
    ["selectRest", "openMap", "backToZIP"],
    [
        'http://www.zdorovieinfo.ru/upload/images/slides/490x330_%D0%95%D0%B4%D0%B0_%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%B0%D1%8F-%D1%83%D0%B1%D0%B8%D0%B2%D0%B0%D0%B5%D1%82_5.jpg',
        'http://www.zdorovieinfo.ru/upload/images/slides/490x330_%D0%95%D0%B4%D0%B0_%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%B0%D1%8F-%D1%83%D0%B1%D0%B8%D0%B2%D0%B0%D0%B5%D1%82_5.jpg',
        'http://www.zdorovieinfo.ru/upload/images/slides/490x330_%D0%95%D0%B4%D0%B0_%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%B0%D1%8F-%D1%83%D0%B1%D0%B8%D0%B2%D0%B0%D0%B5%D1%82_5.jpg'
    ],
    ["Select restaurant", "Open map", "Back"]);

//------------------------------------------------------------------------------------------

// subscribe to page events
request.post('https://graph.facebook.com/me/subscribed_apps?access_token=' + process.env.FACEBOOK_PAGE_TOKEN,
    function (err, res, body) {
        if (err) {
            controller.log('Could not subscribe to page messages')
        } else {
            controller.log('Successfully subscribed to Facebook events:', body);
            console.log('Botkit activated');

            // start ticking to send conversation messages
            controller.startTicking()
        }
    }
);

console.log('botkit');

// this is triggered when a user clicks the send-to-messenger plugin
controller.on('facebook_optin', function (bot, message) {
    bot.reply(message, 'Welcome, friend')
});

// this is triggered when a user clicks the postback
controller.on('facebook_postback', function (bot, message) {

    switch (message.payload) {
        case('%start%'):
            bot.reply(message, startPostback);
            break;

        case('backToZIP'):
            localstorage.setStatus(message.user, 1);
            break;

        case('starting'):
            localstorage.setStatus(message.user, 1);
            break;

        case('nextToOrder'):
            localstorage.setStatus(message.user, 2);
            break;

        case('selectRest'):
            localstorage.setStatus(message.user, 3);
            break;

        case('backToRest'):
            localstorage.setStatus(message.user, 2);
            break;

        case('timeselected'):
            localstorage.setStatus(message.user, 4);
            break;

        case('backToTableTime'):
            localstorage.setStatus(message.user, 3);
            break;

        case('selectTime'):
            localstorage.setStatus(message.user, 5);
            break;

        case('selectTable'):
            localstorage.setStatus(message.user, 6);
            break;

        case('selectFood'):
            localstorage.setStatus(message.user, 7);
            break;
        case('backAddItems'):
            localstorage.setStatus(message.user, 6);
            break;

        case('nextPayOrder'):
            localstorage.setStatus(message.user, 8);
            break;

        case('skipComment'):
            localstorage.setStatus(message.user, 9);
            break;

        case('ToPay'):
            localstorage.setStatus(message.user, 10);
            break;
    }

});

// user says anything else
controller.hears('(.*)', 'message_received', (bot, message) => {

    localstorage.get(message.user, (res) => {

        switch (res.status) {
            //Start status
            case(0):
                bot.reply(message, startPostback);
                break;

            case(1):
                if (!message.text.match(/^\d+$/)) {
                    bot.reply(message, "Let's find a perfect lunch spot near you. Simply enter a ZIP code or street address.");
                } else {
                    //Location query. Example 94105 or 1243 or 4444
                    let zipLocation = new RequestZip(message.text);
                    zipLocation.getLocation((send, err) => {
                        if (!err) {
                            bot.reply(message, send);
                        } else {
                            bot.reply(message, "Sorry, we don't find this ZIP");
                        }
                    });
                }
                break;

            case(2):

                new Promise((res, rej) => {
                    res(bot.reply(message, "Where would you like to lunch ?"));
                }).then(() => {
                    console.log("Confirmation detected");
                    bot.reply(message, sliderOfRests)
                });
                break;

            case(3):
                let planeTime = new Attachment('When would like to come?').postback(3, ["Today", "Tomorrow", "Back to restaurants"], ["timeselected", "timeselected", "backToRest"]);
                bot.reply(message, planeTime);
                break;

            case(4):
                new Promise((res, rej) => {
                    res(bot.reply(message, "Launch is available from 11:30 AM to 02:30 PM. Please select table time"));
                }).then(() => {
                    console.log("Confirmation table time detected");
                    let planeTime = new Attachment('When would like to come?').slider(2, 2,
                        ["11:30 AM", "02:30 PM"],
                        [' ', ' '],
                        ["selectTime", "backToTableTime"],
                        ['', ''],
                        ["Select time", "Back"]);

                    bot.reply(message, planeTime)
                });
                break;

            case(5):
                new Promise((res, rej) => {
                    res(bot.reply(message, "Please select a table size..."));
                }).then(() => {
                    console.log("Confirmation table time detected");
                    let tableChoose = new Attachment('When would like to come?').slider(4, 2,
                        ["Table for 1 person", "Table for 2 persons", "Table for 3 persons", "Table for 4 persons"],
                        [' ', ' ', ' ', ' '],
                        ["selectTable", "backToTableTime"],
                        ['', ''],
                        ["Select", "Back"]);

                    bot.reply(message, tableChoose)
                });
                break;
            case(6):
                new Promise((res, rej) => {
                    res(bot.reply(message, "Got it. What ypu will having"));
                }).then(() => {
                    console.log("Confirmation table detected");
                    let dishes = new Attachment('What food do you prefer?').slider(4, 2,
                        ["Food 1", "Food 2", "Food 3", "Food 4"],
                        ['Subtitle for food 1', 'Subtitle for food 2', 'Subtitle for food 3', 'Subtitle for food 4'],
                        ["selectFood", "backToTableTime"],
                        [
                            'http://www.zdorovieinfo.ru/upload/images/slides/490x330_%D0%95%D0%B4%D0%B0_%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%B0%D1%8F-%D1%83%D0%B1%D0%B8%D0%B2%D0%B0%D0%B5%D1%82_5.jpg',
                            'http://www.zdorovieinfo.ru/upload/images/slides/490x330_%D0%95%D0%B4%D0%B0_%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%B0%D1%8F-%D1%83%D0%B1%D0%B8%D0%B2%D0%B0%D0%B5%D1%82_5.jpg',
                            'http://www.zdorovieinfo.ru/upload/images/slides/490x330_%D0%95%D0%B4%D0%B0_%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%B0%D1%8F-%D1%83%D0%B1%D0%B8%D0%B2%D0%B0%D0%B5%D1%82_5.jpg',
                            'http://www.zdorovieinfo.ru/upload/images/slides/490x330_%D0%95%D0%B4%D0%B0_%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%B0%D1%8F-%D1%83%D0%B1%D0%B8%D0%B2%D0%B0%D0%B5%D1%82_5.jpg'
                        ],
                        ["Select", "Back"]);
                    bot.reply(message, dishes)
                });
                break;
            case(7):
                new Promise((res, rej) => {
                    res(bot.reply(message, ":) Great choice! Your order total is $16.46 (Tax $3.12)..."));
                }).then(() => {
                    console.log("Confirmation table detected");
                    let price = new Attachment('Your order total is $16.46', 'Today at 12:30 pm').postback(2, ["Send order", "Add more items"], ["nextPayOrder", "backAddItems"]);
                    bot.reply(message, price);
                });
                break;

            case(8):
                new Promise((res, rej) => {
                    res(bot.reply(message, "Type a comment or special instruction for the restaurant."));
                }).then(() => {
                    console.log("Confirmation table detected");
                    let comments = new Attachment('Skip the step?').postback(2, ["Skip", "Back"], ["skipComment", "backAddItems"]);
                    bot.reply(message, comments);
                });
                break;

            case(9):
                new Promise((res, rej) => {
                    res(bot.reply(message, "Awesome, thanks! How would you like to pay?"));
                }).then(() => {
                    let paymentVar = new Attachment('Visa  3176 (default)').postback(2, ["Select", "Back"], ["ToPay", "backAddItems"]);
                    console.log("Confirmation pay detected");
                    bot.reply(message, paymentVar);
                });
                break;

            case(10):
                bot.reply(message, "Thank's for ordering with TestBot. Your order has been sent to RestaurantName, you get a text message notification closer to the time they open.");
                localstorage.setStatus(message.user, 1);
                break;

            default:
                bot.reply(message, startPostback);
                break;
        }
    });
});

// this function processes the POST request to the webhook
export function handler(obj) {
    controller.debug('GOT A MESSAGE HOOK');
    let message;
    if (obj.entry) {
        for (let e = 0; e < obj.entry.length; e++) {
            for (let m = 0; m < obj.entry[e].messaging.length; m++) {
                var facebook_message = obj.entry[e].messaging[m];

                console.log(facebook_message);

                // normal message
                if (facebook_message.message) {
                    message = {
                        text: facebook_message.message.text,
                        user: facebook_message.sender.id,
                        channel: facebook_message.sender.id,
                        timestamp: facebook_message.timestamp,
                        seq: facebook_message.message.seq,
                        mid: facebook_message.message.mid,
                        attachments: facebook_message.message.attachments
                    };

                    // save if user comes from m.me adress or Facebook search
                    create_user_if_new(facebook_message.sender.id, facebook_message.timestamp);

                    controller.receiveMessage(bot, message)
                }
                // clicks on a postback action in an attachment
                else if (facebook_message.postback) {
                    // trigger BOTH a facebook_postback event
                    // and a normal message received event.
                    // this allows developers to receive postbacks as part of a conversation.
                    message = {
                        payload: facebook_message.postback.payload,
                        user: facebook_message.sender.id,
                        channel: facebook_message.sender.id,
                        timestamp: facebook_message.timestamp
                    };

                    controller.trigger('facebook_postback', [bot, message]);

                    message = {
                        text: facebook_message.postback.payload,
                        user: facebook_message.sender.id,
                        channel: facebook_message.sender.id,
                        timestamp: facebook_message.timestamp
                    };

                    controller.receiveMessage(bot, message)
                }
                // When a user clicks on "Send to Messenger"
                else if (facebook_message.optin) {
                    message = {
                        optin: facebook_message.optin,
                        user: facebook_message.sender.id,
                        channel: facebook_message.sender.id,
                        timestamp: facebook_message.timestamp
                    };

                    // save if user comes from "Send to Messenger"
                    create_user_if_new(facebook_message.sender.id, facebook_message.timestamp);

                    controller.trigger('facebook_optin', [bot, message])
                }
                // message delivered callback
                else if (facebook_message.delivery) {
                    message = {
                        optin: facebook_message.delivery,
                        user: facebook_message.sender.id,
                        channel: facebook_message.sender.id,
                        timestamp: facebook_message.timestamp
                    };

                    controller.trigger('message_delivered', [bot, message])
                }
                else {
                    controller.log('Got an unexpected message from Facebook: ', facebook_message)
                }
            }
        }
    }
}

let create_user_if_new = (id, ts) => {

    localstorage.get(id, (result) => {
        if(result == false) {
            localstorage.save(id, ts, 0);

        } else {
            controller.log("User has been found")
        }
    });
};
