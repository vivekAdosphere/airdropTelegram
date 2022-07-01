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
            }
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
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "Join our Telegram group(Mandatory)", url: "https://t.me/MultiFinance_chat", callback_data: 'telegram_group' }
                        ],
                        [
                            { text: "Join our Telegram channel(Mandatory)", url: "https://t.me/MultiFinance_channel", callback_data: 'telegram_channel' }
                        ],
                        [
                            { text: "Follow our Twitter,like and retweet the pinned post(Mandatory)", url: "https://twitter.com/MultiFiProtocol" }
                        ],
                        [
                            { text: "Follow our Medium(Optional)", url: "https://medium.com/@MultiFiProtocol" }
                        ],
                        [
                            { text: "Follow our Reddit(Optional)", url: "https://reddit.com/u/MultiFinance" }
                        ],
                        [
                            { text: "Join our Discord(Optional)", url: "https://discord.gg/PQSxynESEn" }
                        ],
                        [
                            { text: "Follow Airdrop Detective Twitter,like and retweet the post about the Multi Finance Airdrop. (Optional)", url: "http://www.twitter.com/AirdropDet" }
                        ],
                        [
                            { text: " Join Airdrop Detective Telegram(Optional)", url: "https://t.me/AirdropDetective" }
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
        logger.error(`Error from Send Message with inline keyboard,${JSON.stringify(err.response)}`);
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
                user_id: userID
            }
        })
        console.log(res.data)
        return res.data.result.status === "member" ? true : false

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
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "Join our Telegram group(Mandatory)", url: "https://t.me/MultiFinance_chat" }
                        ],
                        [
                            { text: "Join our Telegram channel(Mandatory)", url: "https://t.me/MultiFinance_channel" }
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
                reply_markup: {
                    keyboard: [
                        [
                            { text: "SKIP THE TASK" }
                        ],

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