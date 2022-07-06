require("dotenv").config();

/**
 * contains info coming from .env moduels
 */

module.exports = {
    PORT: process.env.PORT || 3001,
    TOKEN: process.env.TOKEN,
    TELEGRAM_BASE_API: process.env.TELEGRAM_BASE_API,
    SERVER_URL: process.env.SERVER_URL,
    DATABASE_URL: process.env.DATABASE_URL
}