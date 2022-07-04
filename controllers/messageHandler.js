const mapNames = require("../config/mapNames");
const logger = require("../functionality/logger");
const { MapToLocal } = require("../functionality/mapToLocal");
const { clearFlags } = require("../functionality/utilities");
const languageChooser = require("../language/languageChooser");
const {
    sendMessage,
    checkChannelMemberStatus,
    sendMessageWith3options,
    sendMessageWithInlineKeyboard
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
} = require("../controllers/messagingFunction")

const flowPathIndicator = new MapToLocal(mapNames.flowPathIndicator);

exports.handleTextMessage = async(chatId, message, firstName, lastName) => {
    try {
        chatId = chatId.toString()
        const language = await languageChooser(chatId)

        if (message === "/start") {
            startHandler(chatId);
        } else if (await flowPathIndicator.has(chatId)) {
            switch (await flowPathIndicator.get(chatId)) {
                case "1":
                    answerHandler(chatId, message, firstName, lastName)
                    break
                case "2":
                    sendMessageWithInlineKeyboard(chatId, language.taskList)
                    break
                case "3":
                    twitterProfileHandler(chatId, message)
                    break
                case "4":
                    redditProfileHandler(chatId, message)
                    break
                case "5":
                    discordUsernameHandler(chatId, message)
                    break
                case "6":
                    facebookProfileHandler(chatId, message)
                    break
                case "7":
                    instagramProfileHandler(chatId, message)
                    break
                case "8":
                    discordInvitationHandler(chatId, message)
                    break
                case "9":
                    telegramUsernamesHandler(chatId, message)
                    break
                case "10":
                    firstTelegramUserHandler(chatId, message)
                    break
                case "11":
                    secondTelegramUserHandler(chatId, message)
                    break
                case "12":
                    thirdTelegramUserHandler(chatId, message)
                    break
                case "13":
                    forthTelegramUserHandler(chatId, message)
                    break
                case "14":
                    twitterUsernamesHandler(chatId, message)
                    break
                case "15":
                    firstTwitterUserHandler(chatId, message)
                    break
                case "16":
                    secondTwitterUserHandler(chatId, message)
                    break
                case "17":
                    thirdTwitterUserHandler(chatId, message)
                    break
                case "18":
                    forthTwitterUserHandler(chatId, message)
                    break
                case "19":
                    walletAddressHandler(chatId, message)
                    break
                case "20":
                    thankYouHandler(chatId, message)
                    break
                default:
                    sendMessage(chatId, language.somethingWentWrong)
            }
        } else {
            sendMessage(chatId, language.somethingWentWrong)

        }

    } catch (err) {
        logger.error(`Error from handle text message,${language.somethingWentWrong}`)
        c
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.handleCallback_query = async(chatId, callbackData) => {
    try {
        // console.log("UR DATA IS " + callbackData)
        // console.log(chatId)

        chatId = chatId.toString()

        const language = await languageChooser(chatId)

        const groupId = "@amazew";
        // const channelId = "@amazew";
        if (callbackData) {
            switch (callbackData) {
                case "user_detail":
                    if (await checkChannelMemberStatus(groupId, chatId)) {
                        emailHandler(chatId, language.askForEmail)
                    } else {
                        sendMessageWith3options(chatId, language.dothisFirst)
                    }
                    break

                default:
                    sendMessage(chatId, language.somethingWentWrong)

            }

            // //to check the user is a member of a channel or not

        }

    } catch (err) {
        logger.error(`Error from handle Callback query,${language.somethingWentWrong}`)
        console.log(err.message)
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}