const mapNames = require("../config/mapNames");
const logger = require("../functionality/logger");
const { MapToLocal } = require("../functionality/mapToLocal");
const { clearFlags } = require("../functionality/utilities");
const languageChooser = require("../language/languageChooser");
const { sendMessage } = require("../functionality/messageSender");
const { startHandler, answerHandler } = require("../controllers/messagingFunction")

const flowPathIndicator = new MapToLocal(mapNames.flowPathIndicator);
const selectedCommunicationLanguage = new MapToLocal(mapNames.selectedCommunicationLanguage);

exports.handleTextMessage = async(chatId, message) => {
    try {
        if (message === "hi") {
            startHandler(chatId, languageChooser(chatId).welcomeMessage)
        } else if (flowPathIndicator.has(chatId)) {
            switch (flowPathIndicator.get(chatId)) {
                case "1":
                    answerHandler(chatId, message)
                    break
                default:
                    sendMessage(chatId, languageChooser(chatId).somethingWentWrong)
            }
        }
    } catch (err) {
        logger.error(`Error,${languageChooser(number).somethingWentWrong}`)
        clearFlags(chatId)
    }
}