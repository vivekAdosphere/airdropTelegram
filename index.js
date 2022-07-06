const express = require("express");
const axios = require("axios");
// const url = "https://api.telegram.org/bot";
const config = require("./config/config")

const TOKEN = config.TOKEN;
const SERVER_URL = config.SERVER_URL
const TELEGRAM_BASE_API = `${config.TELEGRAM_BASE_API}${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL + URI
const app = express();
const PORT = config.PORT;
const dbConnector = require("./functionality/dbConnector")
const { handleTextMessage, handleCallback_query, handleVoiceMessages, handlePhotoMessages, handleStickerMessages, handleAnimationMessages, handleDocumentMessages, handleAudioMessages, handleVideoMessages, handleLocationMessages, handlePollMessages, handleContactMessages } = require("./controllers/messageHandler")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * this function used to set the webhook for a specific url
 */

const init = async() => {
    const res = await axios.get(`${TELEGRAM_BASE_API}/setWebhook?url=${WEBHOOK_URL}`);
    console.log(res.data)
}


/**
 * all the user inputs in chat handled here
 */

app.post(URI, async(req, res) => {
    console.log(req.body)

    if (req.body.message) {
        const { first_name: firstName, id: userId, last_name: lastName } = req.body.message.from
        if (req.body.message.text) {
            handleTextMessage(userId, req.body.message.text, firstName, lastName)
        } else if (req.body.message.voice) {
            handleVoiceMessages(userId, req.body.message.voice)
        } else if (req.body.message.photo) {
            handlePhotoMessages(userId, req.body.message.photo)
        } else if (req.body.message.sticker) {
            handleStickerMessages(userId, req.body.message.sticker)
        } else if (req.body.message.animation) {
            handleAnimationMessages(userId, req.body.message.animation)
        } else if (req.body.message.document) {
            handleDocumentMessages(userId, req.body.message.document)
        } else if (req.body.message.audio) {
            handleAudioMessages(userId, req.body.message.audio)
        } else if (req.body.message.video) {
            handleVideoMessages(userId, req.body.message.video)
        } else if (req.body.message.location) {
            handleLocationMessages(userId, req.body.message.location)
        } else if (req.body.message.poll) {
            handlePollMessages(userId, req.body.message.poll)
        } else if (req.body.message.contact) {
            handleContactMessages(userId, req.body.message.contact)
        }
    } else if (req.body.callback_query) {
        const { id: userId } = req.body.callback_query.from;
        handleCallback_query(userId, req.body.callback_query.data)

    }

    res.status(200).end();

});


/**
 * server connection
 */
app.listen(PORT, async() => {
    console.log(`Server is running at ${PORT}`)
    dbConnector().catch((err) => {
        console.log(err)
    });
    await init();
})