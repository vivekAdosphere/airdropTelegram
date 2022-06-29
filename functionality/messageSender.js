const axios = require("axios");
const config = require("../config/config");
const logger = require("../functionality/logger");

const TELEGRAM_API = config.TELEGRAM_BASE_API


exports.sendMessage = async(chatId, message) => {
    try {
        const payload = {
            chat_id: chatId,
            text: message
        }

        const res = await axios({
            url: `${TELEGRAM_API}/sendMessage`,
            method: 'post'
        }, payload)
        return res.data


    } catch (err) {
        logger.error(`Error from Send Message,${JSON.stringify(err.response.data)}`);
        // console.log(err)
        return err.response.data
    }
}