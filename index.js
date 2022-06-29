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
const { handleTextMessage } = require("./controllers/messageHandler")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const init = async() => {
    const res = await axios.get(`${TELEGRAM_BASE_API}/setWebhook?url=${WEBHOOK_URL}`);
    console.log(res.data)
}

app.post(URI, async(req, res) => {

    const msg = req.body.message.text;
    const chat_id = req.body.message.chat.id;
    exports.firstName = req.body.message.chat.first_name;
    if (msg) {
        handleTextMessage(chat_id, msg)
        res.status(200).end();
    }
    console.log(req.body);
    return res.send();

});



app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
    init()
})