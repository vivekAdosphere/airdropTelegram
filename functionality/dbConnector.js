const logger = require("../functionality/logger");
const mongoose = require('mongoose');
const config = require("../config/config");

module.exports = async() => {
    try {
        await mongoose.connect(config.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        logger.info(`Success,Database conncted Successfully`);
        return "connected"

    } catch (err) {
        logger.error(`Error, Database Connection Failed --> ${JSON.stringify(e)}`);
        return "failed"
    }
}