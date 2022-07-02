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
const selectedCommunicationLanguage = new MapToLocal(mapNames.selectedCommunicationLanguage);

exports.handleTextMessage = async(chatId, message, firstName) => {
    try {
        console.log(flowPathIndicator.get(chatId.toString()))
        chatId = chatId.toString()

        if (message === "/start") {
            startHandler(chatId);
        } else if (flowPathIndicator.has(chatId)) {
            switch (flowPathIndicator.get(chatId)) {
                case "1":
                    answerHandler(chatId, message, firstName)
                    break
                case "2":
                    sendMessageWithInlineKeyboard(chatId, languageChooser(chatId).taskList)
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
                    sendMessage(chatId, languageChooser(chatId).somethingWentWrong)
            }
        }

    } catch (err) {
        logger.error(`Error from handle text message,${languageChooser(chatId).somethingWentWrong}`)
        c
        clearFlags(chatId)
    }
}

exports.handleCallback_query = async(chatId, callbackData) => {
    try {
        console.log("UR DATA IS " + callbackData)
        console.log(chatId)

        chatId = chatId.toString()

        const groupId = "@amazew";
        // const channelId = "@amazew";
        if (callbackData) {
            switch (callbackData) {
                case "user_detail":
                    if (await checkChannelMemberStatus(groupId, chatId)) {
                        emailHandler(chatId, languageChooser(chatId).askForEmail)
                    } else {
                        sendMessageWith3options(chatId, languageChooser(chatId).dothisFirst)
                    }
                    break

                default:
                    sendMessage(chatId, languageChooser(chatId).somethingWentWrong)

            }

            // //to check the user is a member of a channel or not

        }

    } catch (err) {
        logger.error(`Error from handle Callback query,${languageChooser(chatId).somethingWentWrong}`)
        console.log(err.message)
        clearFlags(chatId)
    }
}