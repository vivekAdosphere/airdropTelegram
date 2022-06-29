const mapNames = require("../config/mapNames");
const logger = require("../functionality/logger");
const { MapToLocal } = require("../functionality/mapToLocal");
const languageChooser = require('../language/languageChooser');
const { sendMessage } = require("../functionality/messageSender");
const { clearFlags } = require("../functionality/utilities")
const flowPathIndicator = new MapToLocal(mapNames.flowPathIndicator);
const userData = new MapToLocal(mapNames.userData);

const firstName = require("../index")
    //flagupdator
let userDataFlagHandler = (number, key, value) => {
    let dictValues = userData.get(number, value)
    dictValues[key] = value
    userData.set(number, dictValues)
    return;
}


let initDefaultValues = (number, index) => {
    flowPathIndicator.set(number, index)
    userData.set(number, {})
}

exports.startHandler = async(chatId, message) => {
    try {
        clearFlags(chatId)
        sendMessage(chatId, languageChooser(chatId).welcomeMessage)
        initDefaultValues(chatId, "1")
    } catch (err) {
        logger.error(`Error, ${languageChooser(chatId   ).somethingWentWrong}`);
        clearFlags(chatId)
    }
}

exports.answerHandler = async(chatId, message) => {
    try {
        if (message === "45") {
            sendMessage(chatId, `👍 That's correct, ${firstName}\n` + languageChooser(chatId).taskList)
        }

    } catch (err) {
        logger.error(`Error, ${languageChooser(chatId   ).somethingWentWrong}`);
        clearFlags(chatId)
    }
}