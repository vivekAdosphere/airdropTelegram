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
const { handleTextMessage, handleCallback_query } = require("./controllers/messageHandler")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const init = async() => {
    const res = await axios.get(`${TELEGRAM_BASE_API}/setWebhook?url=${WEBHOOK_URL}`);
    console.log(res.data)
}


app.post(URI, async(req, res) => {
    console.log(req.body)

    /**
     * @param to handle text messages
     * TEXT MESSAGE
     * ["updated_id", "message"]
     */

    if (req.body.message) {
        const { first_name: firstName, id: userId, last_name: lastName } = req.body.message.from
        handleTextMessage(userId, req.body.message.text, firstName, lastName)
    }

    /**
     * @param to handle callback query comming from inline keyboard markup buttons
     * TEXT MESSAGE
     * ["updated_id", "message"]
     */
    else if (req.body.callback_query) {
        const { id: userId } = req.body.callback_query.from;
        handleCallback_query(userId, req.body.callback_query.data)
    }

    res.status(200).end();

});



app.listen(PORT, async() => {
    console.log(`Server is running at ${PORT}`)
    dbConnector().catch((err) => {
        console.log(err)
    });
    await init();
})