const axios = require("axios");
const config = require("../config/config");
const logger = require("../functionality/logger");

const TELEGRAM_API = config.TELEGRAM_BASE_API;
const TOKEN = config.TOKEN;

/**
 * @description this function is used to send text message to a particulat user id
 * @param {Number} userId unique id of user chat
 * @param {String} message message to send to a user 
 * @returns data of response
 */

exports.sendMessage = async(userId, message) => {
    try {

        const data = {
            "chat_id": userId,
            "text": message,
        }
        const res = await axios({
            url: `${TELEGRAM_API}${TOKEN}/sendMessage`,
            method: 'post',
            data: data,
            params: {
                parse_mode: "HTML"
            },

        })
        return res.data

    } catch (err) {
        logger.error(`Error from Send Message,${JSON.stringify(err.message)}`);
        return err
    }
}


/**
 * @description this function is used to send text message along with task reply markup buttons to a particulat user id
 * @param {Number} userId unique id of user chat
 * @param {String} message message to send to a user 
 * @returns data of response
 */
exports.sendMessageWithTaskButtons = async(userId, message) => {
    try {
        userId = userId.toString()
        const data = {
            "chat_id": userId,
            "text": message,
            "reply_markup": {
                "inline_keyboard": [
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
        const res = await axios({
            url: `${TELEGRAM_API}${TOKEN}/sendMessage`,
            method: 'post',
            data: data,
            params: {
                parse_mode: "HTML",
            }
        })
        return res.data
    } catch (err) {
        // logger.error(`Error from Send Message with inline keyboard,${JSON.stringify(err.response)}`);
        console.log(err.message)
        return err.response.data
    }
}

/**
 * @description this function is used to check user is a member of a telegram group or not
 * @param {Number} userId unique id of user chat
 * @param {String} message message to send to a user 
 * @returns {Boolean} is member os a group or not
 */
exports.isMemberOfGroup = async(chatId, userID) => {
    try {
        const data = {
            "chat_id": chatId,
            "user_id": userID
        }
        const res = await axios({
            method: 'post',
            url: `${TELEGRAM_API}${TOKEN}/getChatMember`,
            data: data
        })
        console.log(res.data)
        if (res.data.result.status === "member" || res.data.result.status === "administrator") {
            return true
        } else {
            return false
        }

    } catch (err) {
        logger.error(`Error from group member status,${JSON.stringify(err.response.data)}`);
        return err.response.data
    }
}

/**
 * @description this function is used to check user is a member of a telegram channel or not
 * @param {Number} userId unique id of user chat
 * @param {String} message message to send to a user 
 * @returns {Boolean} is member os a channel or not
 */
exports.isMemberOfChannel = async(userId, userID) => {
    try {
        const data = {
            "chat_id": userId,
            "user_id": userID,
        }
        const res = await axios({
            method: 'post',
            url: `${TELEGRAM_API}${TOKEN}/IsChatMember}`,
            data: data,
            params: {
                parse_mode: "HTML"
            }
        })
        console.log(res.data)
        return res.data.result.status === "member" || "administrator" ? true : false

    } catch (err) {
        logger.error(`Error from  channel member status,${JSON.stringify(err.response.data)}`);
        return err.response.data
    }
}


/**
 * @description this function is used to sendMessge with mandatory task buttons
 * @param {Number} userId unique id of user chat
 * @param {String} message message to send to a user 
 * @returns response data
 */

exports.sendMandatoryMessage = async(userId, message) => {
    try {
        userId = userId.toString()
        const data = {
            "chat_id": userId,
            "text": message,
            "reply_markup": {
                "inline_keyboard": [
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
        const res = await axios({
            url: `${TELEGRAM_API}${TOKEN}/sendMessage`,
            method: 'post',
            data: data,
            params: {
                parse_mode: "HTML",
            }
        })
        return res.data
    } catch (err) {
        logger.error(`Error from Send Message with inline keyboard,${JSON.stringify(err.response.data)}`);
        return err.response.data
    }
}


/**
 * @description this function is used to send message with Enter your wallet address button
 * @param {Number} userId unique id of user chat
 * @param {String} message message to send to a user 
 * @returns response data
 */
exports.sendWalletAddressButton = async(userId, message) => {
    try {
        const data = {
            "chat_id": userId,
            "text": message,
            "reply_markup": {
                "keyboard": [
                    [
                        { text: "ENTER YOUR WALLET ADDRESS" }
                    ]
                ],
                "resize_keyboard": true,
                "one_time_keyboard": true,
            },
        }
        const res = await axios({
            url: `${TELEGRAM_API}${TOKEN}/sendMessage`,
            method: 'post',
            data: data,
            params: {
                parse_mode: "HTML",
            }
        })
        return res.data

    } catch (err) {
        logger.error(`Error from send message with one button,${JSON.stringify(err.response.data)}`);
        return err.response.data
    }
}

/**
 * @description this function is used to sendmessage with 2 buttons
 * @param {Number} userId unique id of chat user
 * @param {String} message message to send to a user 
 * @returns response data
 */
exports.sendMessageWith2Buttons = async(userId, message) => {
    try {
        userId = userId.toString();

        const data = {
            "chat_id": userId,
            "text": message,
            "reply_markup": {
                "keyboard": [
                    [
                        { text: "SKIP THE TASK" }
                    ],
                    [
                        { text: "ENTER YOUR WALLET ADDRESS" }
                    ]
                ],
                "resize_keyboard": true,
                "one_time_keyboard": true
            }
        }
        const res = await axios({
            url: `${TELEGRAM_API}${TOKEN}/sendMessage`,
            method: 'post',
            data: data,
            params: {
                parse_mode: "HTML",
            }
        })

    } catch (err) {
        logger.error(`Error from Send Message with 2 buttons,${JSON.stringify(err.response.data)}`);
        return err.response.data
    }
}