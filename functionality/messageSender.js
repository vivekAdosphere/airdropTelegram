const axios = require("axios");
const config = require("../config/config");
const logger = require("../functionality/logger");

const TELEGRAM_API = config.TELEGRAM_BASE_API;
const TOKEN = config.TOKEN;

exports.sendMessage = async(chatId, message) => {
    try {
        const res = await axios({
            url: `${TELEGRAM_API}${TOKEN}/sendMessage`,
            method: 'post',
            params: {
                chat_id: chatId,
                text: message,
                parse_mode: "HTML"
            },

        })
        return res.data

    } catch (err) {
        logger.error(`Error from Send Message,${JSON.stringify(err.response.data)}`);
        // console.log(err)
        return err.response.data
    }
}

exports.sendMessageWithInlineKeyboard = async(chatId, message) => {
    try {
        chatId = chatId.toString()
        const res = await axios({
            url: `${TELEGRAM_API}${TOKEN}/sendMessage`,
            method: 'post',
            params: {
                chat_id: chatId,
                text: message,
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "Join our Telegram group(Mandatory)", url: "https://t.me/amazew", callback_data: 'telegram_group' }
                        ],
                        [
                            { text: "Join our Telegram channel(Mandatory)", url: "https://t.me/theamazeworld", callback_data: 'telegram_channel' }
                        ],
                        [
                            { text: "Follow our Twitter,like and retweet the pinned post(Optional)", url: "https://twitter.com/TheAmazeWorld" }
                        ],
                        [
                            { text: "Join our Reddit Community(Optional)", url: "https://www.reddit.com/r/global_amazeworld/" }
                        ],
                        [
                            { text: "Join our Discord Server(Optional)", url: "https://discord.gg/nbRvq7VbJ7" }
                        ],
                        [
                            { text: "Follow our Facebook page(Optional)", url: "https://www.facebook.com/amazeworldglobal" }
                        ],
                        [
                            { text: "Follow our Instagram page(Optional)", url: "https://www.instagram.com/amazeworldglobal/" }
                        ],
                        [
                            { text: "Submit your details", callback_data: "user_detail" }
                        ]
                    ]
                }
            }
        })
        return res.data
    } catch (err) {
        // logger.error(`Error from Send Message with inline keyboard,${JSON.stringify(err.response)}`);
        console.log(err.message)
        return err.response.data
    }
}

exports.checkChannelMemberStatus = async(chatID, userID, type = "group") => {
    try {
        const res = await axios({
            method: 'post',
            url: `${TELEGRAM_API}${TOKEN}/${type==="group" ? "getChatMember" : ""}`,
            params: {
                chat_id: chatID,
                user_id: userID,
                parse_mode: "HTML"
            }
        })
        console.log(res.data)
        return res.data.result.status === "member" || "administrator" ? true : false

    } catch (err) {
        logger.error(`Error from check channel member status,${JSON.stringify(err.response.data)}`);
        return err.response.data
    }
}


exports.sendMessageWith3options = async(chatId, message) => {
    try {
        chatId = chatId.toString()
        const res = await axios({
            url: `${TELEGRAM_API}${TOKEN}/sendMessage`,
            method: 'post',
            params: {
                chat_id: chatId,
                text: message,
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "Join our Telegram group(Mandatory)", url: "https://t.me/amazew" }
                        ],
                        [
                            { text: "Join our Telegram channel(Mandatory)", url: "https://t.me/theamazeworld" }
                        ],
                        [
                            { text: "Submit your details", callback_data: "user_detail" }
                        ]
                    ]
                }
            }
        })
        return res.data
    } catch (err) {
        logger.error(`Error from Send Message with inline keyboard,${JSON.stringify(err.response.data)}`);
        return err.response.data
    }
}

exports.sendMessageWithOneButton = async(chatID, message, text, data) => {
    try {
        const res = await axios({
            url: `${TELEGRAM_API}${TOKEN}/sendMessage`,
            method: 'post',
            params: {
                chat_id: chatID,
                text: message,
                parse_mode: "HTML",
                reply_markup: {
                    keyboard: [

                        [
                            { text: "ENTER YOUR WALLET ADDRESS" }
                        ]

                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,

                },


            }
        })
        return res.data

    } catch (err) {
        logger.error(`Error from send message with one button,${JSON.stringify(err.response.data)}`);
        return err.response.data
    }
}


exports.sendMessageWith2Buttons = async(chatID, message) => {
    try {
        chatID = chatID.toString();
        const res = await axios({
            "url": `${TELEGRAM_API}${TOKEN}/sendMessage`,
            "method": 'post',
            params: {
                chat_id: chatID,
                text: message,
                parse_mode: "HTML",
                reply_markup: {
                    keyboard: [
                        [
                            { text: "SKIP THE TASK" }
                        ],
                        [
                            { text: "ENTER YOUR WALLET ADDRESS" }
                        ]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            }
        })

    } catch (err) {
        logger.error(`Error from Send Message with 2 buttons,${JSON.stringify(err.response.data)}`);
        return err.response.data
    }
}