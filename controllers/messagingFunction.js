const mapNames = require("../config/mapNames");
const logger = require("../functionality/logger");
const { MapToLocal } = require("../functionality/mapToLocal");
const languageChooser = require('../language/languageChooser');
const { sendMessage, sendMessageWithInlineKeyboard, sendMessageWith2Buttons } = require("../functionality/messageSender");
const { clearFlags, urlVerifier } = require("../functionality/utilities")
const flowPathIndicator = new MapToLocal(mapNames.flowPathIndicator);
const userData = new MapToLocal(mapNames.userData);
const validate = require("validation-master")

const firstName = require("../index")
    //flagupdator
let userDataFlagHandler = (chatId, key, value) => {
    let dictValues = userData.get(chatId, value)
    dictValues[key] = value
    userData.set(chatId, dictValues)
    return;
}


let initDefaultValues = (chatId, index) => {
    flowPathIndicator.set(chatId, index)
    userData.set(chatId, {})
}

function generateOneRandom(chatId) {
    var num1 = Math.ceil(50 * Math.random(0, 50));
    console.log("num1 : " + num1)
    userDataFlagHandler(chatId, "num1", num1)
    return num1
}

function generateTwoRandom(chatId) {
    var num2 = Math.ceil(50 * Math.random(0, 50));
    console.log("num1 : " + num2)
    userDataFlagHandler(chatId, "num2", num2)
    return num2
}


function captcha(num1, num2) {
    var answer = num1 + num2;
    console.log("Answer from captcha" + answer)
    return answer;
}

exports.startHandler = async(chatId) => {
    try {
        clearFlags(chatId)

        await initDefaultValues(chatId, "1");

        await sendMessage(chatId, `${languageChooser(chatId).welcomeMessage}: ${generateOneRandom(chatId)} + ${generateTwoRandom(chatId)} =`);
        // console.log(captcha())

    } catch (err) {
        logger.error(`Error from start handler, ${languageChooser(chatId).somethingWentWrong}`);
        console.log(err.message)
        clearFlags(chatId)
    }
}


exports.answerHandler = async(chatId, message, firstName) => {

    try {
        if (message == captcha(userData.get(chatId).num1, userData.get(chatId).num2)) {
            sendMessageWithInlineKeyboard(chatId, `👍 That 's correct, ${firstName}\n` + languageChooser(chatId).taskList)
            flowPathIndicator.set(chatId, "2")

        } else {

            await sendMessage(chatId, languageChooser(chatId).wrongAnswer);
            await sendMessage(chatId, `${generateOneRandom(chatId)} + ${generateTwoRandom(chatId)} =`);
        }


    } catch (err) {
        logger.error(`Error from answer handler , ${languageChooser(chatId).somethingWentWrong}`);
        console.log(err.message)
        clearFlags(chatId)
    }
}

exports.emailHandler = async(chatId, message) => {
    try {
        await sendMessage(chatId, languageChooser(chatId).askForEmail)
        flowPathIndicator.set(chatId, "3")
    } catch (err) {
        logger.error(`Error from email handler, ${languageChooser(chatId).somethingWentWrong}`);
        clearFlags(chatId)
    }
}

exports.twitterProfileHandler = async(chatId, message) => {
    try {
        if (validate.emailValidator(message)) {
            await sendMessage(chatId, languageChooser(chatId).askForTwitterProfile);
            flowPathIndicator.set(chatId, "4")
        } else {
            await sendMessage(chatId, languageChooser(chatId).wrongAnswer)
        }


    } catch (err) {
        logger.error(`Error from twitter handler, ${languageChooser(chatId).somethingWentWrong}`);
        clearFlags(chatId)
    }
}

exports.retweetProfileHandler = async(chatId, message) => {
    try {
        if (await urlVerifier(message, "twitter")) {
            await sendMessage(chatId, languageChooser(chatId).askForRetweetPostLink)
            flowPathIndicator.set(chatId, "5")
        } else {
            await sendMessage(chatId, languageChooser(chatId).wrongAnswer)
        }
    } catch (err) {

    }
}


exports.redditProfileHandler = async(chatId, message) => {
    try {
        console.log(await urlVerifier(message, "twitter"))
        if (await urlVerifier(message, "twitter")) {
            await sendMessage(chatId, languageChooser(chatId).askForReddit)
            flowPathIndicator.set(chatId, "6")
        } else {
            await sendMessage(chatId, languageChooser(chatId).wrongAnswer)
        }


    } catch (err) {
        logger.error(`Error from reddit handler, ${languageChooser(chatId).somethingWentWrong}`);
        clearFlags(chatId)
    }
}

exports.discordUsernameHandler = async(chatId, message) => {
    try {
        if (await urlVerifier(message, "reddit")) {
            await sendMessage(chatId, languageChooser(chatId).askForDiscordUserName)
            flowPathIndicator.set(chatId, "7")
        } else {
            await sendMessage(chatId, languageChooser(chatId).wrongAnswer)
        }


    } catch (err) {
        logger.error(`Error from discord handler, ${languageChooser(chatId).somethingWentWrong}`);
        clearFlags(chatId)
    }
}

exports.facebookProfileHandler = async(chatId, message) => {
    try {
        if (message.includes("#")) {
            await sendMessageWith2Buttons(chatId, languageChooser(chatId).askForFacebookProfileLink, "facebook_profile");
            flowPathIndicator.set(chatId, "8")
        } else {
            await sendMessage(chatId, languageChooser(chatId).wrongAnswer)
        }

    } catch (err) {
        logger.error(`Error from discord handler, ${languageChooser(chatId).somethingWentWrong}`);
        clearFlags(chatId)
    }
}
exports.instagramProfileHandler = async(chatId, message) => {
    try {
        if (await urlVerifier(message, "facebook")) {
            await sendMessageWith2Buttons(chatId, languageChooser(chatId).askForInstagramProfileLink, "instagram_profile");
            flowPathIndicator.set(chatId, "9")

        } else {
            await sendMessage(chatId, languageChooser(chatId).wrongAnswer)
        }

    } catch (err) {
        logger.error(`Error from instagram handler, ${languageChooser(chatId).somethingWentWrong}`);
        clearFlags(chatId)
    }
}

exports.discordInvitationHandler = async(chatId, message) => {
    try {
        if (await urlVerifier(message, "instagram")) {
            await sendMessageWith2Buttons(chatId, languageChooser(chatId).askForDiscordInvitationLink, "discord_invitation")
            flowPathIndicator.set(chatId, "10")
        } else {
            await sendMessage(chatId, languageChooser(chatId).wrongAnswer)
        }


    } catch (err) {
        logger.error(`Error from discord invititaion handler, ${languageChooser(chatId).somethingWentWrong}`);
        clearFlags(chatId)
    }
}

exports.telegramUsernamesHandler = async(chatId, message) => {
    try {
        if (await urlVerifier(message, "discord")) {
            await sendMessage(chatId, languageChooser(chatId).askForTelegramUserNames);
            flowPathIndicator.set(chatId, "11");
        } else {
            await sendMessage(chatId, languageChooser(chatId).wrongAnswer)
        }

    } catch (err) {
        logger.error(`Error from telegram usernames handler, ${languageChooser(chatId).somethingWentWrong}`);
        clearFlags(chatId)
    }
}

exports.twitterUsernamesHandler = async(chatId, message) => {
    try {
        await sendMessage(chatId, languageChooser(chatId).askForTwitterUserNames)
        flowPathIndicator.set(chatId, "12")
    } catch (err) {
        logger.error(`Error from twitter user names handler, ${languageChooser(chatId).somethingWentWrong}`);
        clearFlags(chatId)
    }
}

exports.walletAddressHandler = async(chatId, message) => {
    try {
        await sendMessage(chatId, languageChooser(chatId).askForWalletAddress);
        flowPathIndicator.set(chatId, "13");
    } catch (err) {
        logger.error(`Error from wallet address handler, ${languageChooser(chatId).somethingWentWrong}`);
        clearFlags(chatId)
    }
}

exports.thankYouHandler = async(chatId, message) => {
    try {
        await sendMessage(chatId, languageChooser(chatId).thankYouMessage)
        clearFlags(chatId)

    } catch (err) {
        logger.error(`Error from thank you handler, ${languageChooser(chatId).somethingWentWrong}`);
        clearFlags(chatId)
    }
}