const mapNames = require("../config/mapNames");
const logger = require("../functionality/logger");
const { MapToLocal } = require("../functionality/mapToLocal");
const { clearFlags } = require("../functionality/utilities");
const languageChooser = require("../language/languageChooser");
const {
    sendMessage,
    isMemberOfGroup,
    sendMandatoryMessage,
    sendMessageWithTaskButtons

} = require("../functionality/messageSender");
const {
    startHandler,
    answerHandler,
    emailHandler,
    twitterProfileHandler,
    redditProfileHandler,
    discordUsernameHandler,
    facebookProfileHandler,
    instagramProfileHandler,
    discordInvitationHandler,

    walletAddressHandler,

    firstTelegramUserHandler,
    secondTelegramUserHandler,
    thirdTelegramUserHandler,
    forthTelegramUserHandler,
    secondTwitterUserHandler,
    firstTwitterUserHandler,
    thirdTwitterUserHandler,
    forthTwitterUserHandler,
    fifthTwitterUserHandler,
    fifthTelegramUserHandler,
} = require("../controllers/messagingFunction");
const { updateInfo } = require("../functionality/service");

const flowPathIndicator = new MapToLocal(mapNames.flowPathIndicator);


/**
 * @description this function handles text messages coming from user input
 * @param {Number} userId unique id of chat user
 * @param {String} message message comming from user input
 * @param {String} firstName first name of the user
 * @param {String} lastName last name if the user
 */

exports.handleTextMessage = async(userId, message, firstName, lastName) => {
    const language = await languageChooser(userId)
    try {
        userId = userId.toString()
        if (message === "/start") {
            startHandler(userId);
        } else if (await flowPathIndicator.has(userId)) {
            switch (await flowPathIndicator.get(userId)) {
                case "1":
                    answerHandler(userId, message, firstName, lastName)
                    break
                case "2":
                    sendMessageWithTaskButtons(userId, language.taskList)
                    break
                case "3":
                    emailHandler(userId, message)
                    break
                case "4":
                    twitterProfileHandler(userId, message)
                    break
                case "5":
                    redditProfileHandler(userId, message)
                    break
                case "6":
                    discordUsernameHandler(userId, message)
                    break
                case "7":
                    facebookProfileHandler(userId, message)
                    break
                case "8":
                    instagramProfileHandler(userId, message)
                    break
                case "9":
                    discordInvitationHandler(userId, message)
                    break
                case "10":
                    firstTelegramUserHandler(userId, message)
                    break
                case "11":
                    secondTelegramUserHandler(userId, message)
                    break
                case "12":
                    thirdTelegramUserHandler(userId, message)
                    break
                case "13":
                    forthTelegramUserHandler(userId, message)
                    break
                case "14":
                    fifthTelegramUserHandler(userId, message)
                    break
                case "15":
                    firstTwitterUserHandler(userId, message)
                    break
                case "16":
                    secondTwitterUserHandler(userId, message)
                    break
                case "17":
                    thirdTwitterUserHandler(userId, message)
                    break
                case "18":
                    forthTwitterUserHandler(userId, message)
                    break
                case "19":
                    fifthTwitterUserHandler(userId, message)
                    break
                case "20":
                    walletAddressHandler(userId, message)
                    break
                default:
                    sendMessage(userId, language.somethingWentWrong)
            }
        } else {
            sendMessage(userId, language.somethingWentWrong)
        }
    } catch (err) {
        logger.error(`Error from handle text message,${err.message}`)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}


/**
 * @description handles callback data(payload) when user click any reply markup button
 * @param {Number} userId  unique id of chat user
 * @param {String} callbackData payload of specific reply markup button
 */

exports.handleCallback_query = async(userId, callbackData) => {
    const language = await languageChooser(userId)
    try {
        userId = userId.toString()
        const groupId = "@amazew";
        const channelId = "@theamazeworld"
        if (callbackData) {
            switch (callbackData) {
                case "user_detail":
                    if (await isMemberOfGroup(groupId, userId)) {
                        await updateInfo({ user_id: userId }, { is_joined_telegram_group: true })
                        await sendMessage(userId, language.askForEmail)
                        await flowPathIndicator.set(userId, "3")
                    } else {
                        sendMandatoryMessage(userId, language.dothisFirst)
                    }
                    break
                default:
                    sendMessage(userId, language.somethingWentWrong)
            }
        }
    } catch (err) {
        logger.error(`Error from handle Callback query,${err.message}`)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description handles voice messages entered by user
 * @param {Number} userId unique id of chat user
 */

exports.handleVoiceMessages = async(userId) => {
    try {
        userId = userId.toString()
        const language = await languageChooser(userId)
        await sendMessage(userId, language.errorForVoice)
    } catch (err) {
        logger.error(`Error from voice hanlder,${err.message}`)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description handles photo messages entered by user
 * @param {Number} userId unique id of chat user
 */
exports.handlePhotoMessages = async(userId) => {
    try {
        userId = userId.toString()
        const language = await languageChooser(userId)
        await sendMessage(userId, language.errorForPhoto)
    } catch (err) {
        logger.error(`Error from photo handler,${err.message}`)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description handles sticker messages entered by user
 * @param {Number} userId unique id of chat user
 */
exports.handleStickerMessages = async(userId) => {
    try {
        userId = userId.toString()
        const language = await languageChooser(userId)
        await sendMessage(userId, language.errorForSticker)
    } catch (err) {
        logger.error(`Error from handle sticker,${err.message}`)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description handles animation messages entered by user
 * @param {Number} userId unique id of chat user
 */
exports.handleAnimationMessages = async(userId) => {
    try {
        userId = userId.toString()
        const language = await languageChooser(userId)
        await sendMessage(userId, language.errorForAnimation)
    } catch (err) {
        logger.error(`Error from animation handler,${err.message}`)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description handles document messages entered by user
 * @param {Number} userId unique id of chat user
 */
exports.handleDocumentMessages = async(userId) => {
    try {
        userId = userId.toString()
        const language = await languageChooser(userId)
        await sendMessage(userId, language.errorForAnimation)
    } catch (err) {
        logger.error(`Error from document handler,${err.message}`)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description handles audio messages entered by user
 * @param {Number} userId unique id of chat user
 */
exports.handleAudioMessages = async(userId) => {
    try {
        userId = userId.toString()
        const language = await languageChooser(userId)
        await sendMessage(userId, language.errorForAudio)
    } catch (err) {
        logger.error(`Error from audio handler,${err.message}`)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description handles video messages entered by user
 * @param {Number} userId unique id of chat user
 */
exports.handleVideoMessages = async(userId) => {
    try {
        userId = userId.toString()
        const language = await languageChooser(userId)
        await sendMessage(userId, language.errorForVideo)
    } catch (err) {
        logger.error(`Error from video handler,${err.message}`)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description handles location messages entered by user
 * @param {Number} userId unique id of chat user
 */
exports.handleLocationMessages = async(userId) => {
    try {
        userId = userId.toString()
        const language = await languageChooser(userId)
        await sendMessage(userId, language.errorForLocation)
    } catch (err) {
        logger.error(`Error from location handler,${err.message}`)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description handles poll messages entered by user
 * @param {Number} userId unique id of chat user
 */

exports.handlePollMessages = async(userId) => {
    try {
        userId = userId.toString()
        const language = await languageChooser(userId)
        await sendMessage(userId, language.errorForPoll)
    } catch (err) {
        logger.error(`Error from poll handler,${err.message}`)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description handles contact messages entered by user
 * @param {Number} userId unique id of chat user
 */
exports.handleContactMessages = async(userId) => {
    try {
        userId = userId.toString()
        const language = await languageChooser(userId)
        await sendMessage(userId, language.errorForPoll)
    } catch (err) {
        logger.error(`Error from poll handler,${err.message}`)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}