const mapNames = require("../config/mapNames");
const logger = require("../functionality/logger");
const { MapToLocal } = require("../functionality/mapToLocal");
const { clearFlags } = require("../functionality/utilities");
const languageChooser = require("../language/languageChooser");
const { sendMessage, checkChannelMemberStatus, sendMessageWith3options, sendMessageWithInlineKeyboard } = require("../functionality/messageSender");
const { startHandler, answerHandler, emailHandler, twitterProfileHandler, redditProfileHandler, discordUsernameHandler, facebookProfileHandler, instagramProfileHandler, discordInvitationHandler, telegramUsernamesHandler, twitterUsernamesHandler, walletAddressHandler, thankYouHandler, retweetProfileHandler } = require("../controllers/messagingFunction")

const flowPathIndicator = new MapToLocal(mapNames.flowPathIndicator);
const selectedCommunicationLanguage = new MapToLocal(mapNames.selectedCommunicationLanguage);

exports.handleTextMessage = async(chatId, message, firstName) => {
    try {
        console.log(flowPathIndicator.get(chatId.toString()))
        chatId = chatId.toString()
        if (message === "/start") {
            startHandler(chatId);
        } else if (message === "SKIP THE TASK") {
            flowPathIndicator.set(chatId, "8")

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
                    retweetProfileHandler(chatId, message)
                    break
                case "5":
                    redditProfileHandler(chatId, message)
                    break
                case "6":
                    discordUsernameHandler(chatId, message)
                    break
                case "7":
                    facebookProfileHandler(chatId, message)
                    break
                case "8":
                    instagramProfileHandler(chatId, message)
                    break
                case "9":
                    discordInvitationHandler(chatId, message)
                    break
                case "10":
                    telegramUsernamesHandler(chatId, message)
                    break
                case "11":
                    twitterUsernamesHandler(chatId, message)
                    break
                case "12":
                    walletAddressHandler(chatId, message)
                    break
                case "13":
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

        const groupId = "@MultiFinance_chat";
        if (callbackData) {
            switch (callbackData) {
                case "user_detail":
                    if (await checkChannelMemberStatus(groupId, chatId)) {
                        emailHandler(chatId, languageChooser(chatId).askForEmail)
                    } else {
                        sendMessageWith3options(chatId, languageChooser(chatId).dothisFirst)
                    }
                    break
                case "facebook_profile":
                    break
                case "instagram_profile":
                    discordInvitationHandler(chatId, message)
                    break
                case "discord_invitation":
                    telegramUsernamesHandler(chatId, message)
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