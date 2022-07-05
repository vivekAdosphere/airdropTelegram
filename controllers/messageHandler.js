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
    telegramUsernamesHandler,
    twitterUsernamesHandler,
    walletAddressHandler,
    thankYouHandler,
    firstTelegramUserHandler,
    secondTelegramUserHandler,
    thirdTelegramUserHandler,
    forthTelegramUserHandler,
    secondTwitterUserHandler,
    firstTwitterUserHandler,
    thirdTwitterUserHandler,
    forthTwitterUserHandler,
} = require("../controllers/messagingFunction");
const { updateInfo } = require("../functionality/service");

const flowPathIndicator = new MapToLocal(mapNames.flowPathIndicator);


/**
 * @param all the text related functions handled here
 */


exports.handleTextMessage = async(userId, message, firstName, lastName) => {
    try {

        userId = userId.toString()
        const language = await languageChooser(userId)
        if (message === "/start") {
            startHandler(userId);
        } else if (await flowPathIndicator.has(userId)) {
            console.log(await flowPathIndicator.get(userId))

            switch (await flowPathIndicator.get(userId)) {
                case "1":
                    answerHandler(userId, message, firstName, lastName)
                    break
                case "2":
                    sendMessageWithTaskButtons(userId, language.taskList)
                    break
                case "3":
                    twitterProfileHandler(userId, message)
                    break
                case "4":
                    redditProfileHandler(userId, message)
                    break
                case "5":
                    discordUsernameHandler(userId, message)
                    break
                case "6":
                    facebookProfileHandler(userId, message)
                    break
                case "7":
                    instagramProfileHandler(userId, message)
                    break
                case "8":
                    discordInvitationHandler(userId, message)
                    break
                case "9":
                    telegramUsernamesHandler(userId, message)
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
                    twitterUsernamesHandler(userId, message)
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
                    walletAddressHandler(userId, message)
                    break
                case "20":
                    thankYouHandler(userId, message)
                    break
                default:
                    sendMessage(userId, language.somethingWentWrong)
            }
        } else {
            sendMessage(userId, language.somethingWentWrong)

        }

    } catch (err) {
        const language = await languageChooser(userId)
        logger.error(`Error from handle text message,${language.somethingWentWrong}`)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}



/**
 * @param all the callback query comming from inline markup buttons handled here
 */
exports.handleCallback_query = async(userId, callbackData) => {
    try {

        userId = userId.toString()
        const language = await languageChooser(userId)
        const groupId = "@amazew";
        const channelId = "@theamazeworld"
            // const channelId = "@amazew";
        if (callbackData) {
            switch (callbackData) {
                case "user_detail":
                    if (await isMemberOfGroup(groupId, userId)) {
                        await updateInfo({ chat_id: userId }, { is_joined_telegram_group: true })
                        emailHandler(userId, language.askForEmail)
                    } else {
                        sendMandatoryMessage(userId, language.dothisFirst)
                    }
                    break

                default:
                    sendMessage(userId, language.somethingWentWrong)

            }

            // //to check the user is a member of a channel or not

        }

    } catch (err) {
        logger.error(`Error from handle Callback query,${language.somethingWentWrong}`)
        console.log(err.message)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}