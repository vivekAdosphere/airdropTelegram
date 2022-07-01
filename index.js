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
const { sendMessage } = require("./functionality/messageSender")
const languageChooser = require("./language/languageChooser")
const { handleTextMessage, handleCallback_query } = require("./controllers/messageHandler")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const init = async() => {
    const res = await axios.get(`${TELEGRAM_BASE_API}/setWebhook?url=${WEBHOOK_URL}`);
    console.log(res.data)
}

app.post(URI, async(req, res) => {
    console.log(req.body)

    // TEXT MESSAGE
    // ["updated_id", "message"]
    if (req.body.message) {
        const { first_name: firstName, id: chat_id } = req.body.message.from

        handleTextMessage(chat_id, req.body.message.text, firstName)


    }
    // REPLY MARKUP BUTTON
    // ["updated_id", "callback_query"]
    else if (req.body.callback_query) {
        const { id: chat_id } = req.body.callback_query.from;
        console.log("In callback handler")
        handleCallback_query(chat_id, req.body.callback_query.data)
    }

    res.status(200).end();

});



app.listen(PORT, async() => {
    console.log(`Server is running at ${PORT}`)
    await init()
})