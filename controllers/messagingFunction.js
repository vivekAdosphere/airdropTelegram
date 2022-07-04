const mapNames = require("../config/mapNames");
const logger = require("../functionality/logger");
const { MapToLocal } = require("../functionality/mapToLocal");
const languageChooser = require('../language/languageChooser');
const { sendMessage, sendMessageWithInlineKeyboard, sendMessageWith2Buttons, sendMessageWithOneButton } = require("../functionality/messageSender");
const {
    clearFlags,
    urlVerifier,
} = require("../functionality/utilities");
const { saveUserDetail, updateInfo, checkIfUserIsregistered, checkLevelOneDone, checkUserFbProfile, checkUserInstaProfile, checkDiscordInvitation, } = require("../functionality/service")
const flowPathIndicator = new MapToLocal(mapNames.flowPathIndicator);
const userData = new MapToLocal(mapNames.userData);
const validate = require("validation-master")

//flagupdator
let userDataFlagHandler = async(chatId, key, value) => {
    try {
        let dictValues = await userData.get(chatId, value)
        dictValues[key] = value
        await userData.set(chatId, dictValues)
        return;
    } catch (err) {
        throw err
    }
}

let generateOneRandom = async(chatId) => {
    try {
        let num1 = Math.ceil(20 * Math.random(0, 20));
        await userDataFlagHandler(chatId, "num1", num1)
        return num1
    } catch (err) {
        throw err
    }
}

let generateTwoRandom = async(chatId) => {
    try {
        let num2 = Math.ceil(30 * Math.random(0, 40));
        await userDataFlagHandler(chatId, "num2", num2)
        return num2
    } catch (err) {
        throw err
    }
}

let captcha = (num1, num2) => {
    let answer = num1 + num2;
    return answer;
}



let initDefaultValues = async(chatId, index) => {
    try {
        await flowPathIndicator.set(chatId, index)
        await userData.set(chatId, {})
    } catch (err) {
        throw err
    }
}



exports.startHandler = async(chatId) => {
    try {
        const language = await languageChooser(chatId)
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })

        if (await checkIfUserIsregistered(chatId)) {
            await updateInfo({ chat_id: chatId })
        } else {
            // console.log(chatId)

            await saveUserDetail({ chat_id: chatId })
        }


        await initDefaultValues(chatId, "1");
        await sendMessage(chatId, `${language.welcomeMessage}: ${await generateOneRandom(chatId)} + ${await generateTwoRandom(chatId)} `);
        // console.log(captcha())

    } catch (err) {
        logger.error(`Error from start handler, ${language.somethingWentWrong}`);
        // console.log(err)
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}


exports.answerHandler = async(chatId, message, firstName, lastName) => {

    try {
        const language = await languageChooser(chatId)

        await updateInfo({ chat_id: chatId }, { "UserInfo.name": firstName + lastName })
        if (message == captcha((await userData.get(chatId)).num1, (await userData.get(chatId)).num2)) {
            sendMessageWithInlineKeyboard(chatId, `👍 That 's correct, <b>${firstName}</b>\n` + language.taskList)
            await flowPathIndicator.set(chatId, "2")
        } else {
            await sendMessage(chatId, language.wrongAnswer);
            await sendMessage(chatId, `${await generateOneRandom(chatId)} + ${await generateTwoRandom(chatId)} =`);
        }


    } catch (err) {
        logger.error(`Error from answer handler , ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.emailHandler = async(chatId, message) => {
    try {
        await updateInfo({ chat_id: chatId }, { is_joined_telegram_group: true, is_joined_telegram_channel: true })
        const language = await languageChooser(chatId)
        await sendMessage(chatId, language.askForEmail)
        await flowPathIndicator.set(chatId, "3")
    } catch (err) {
        logger.error(`Error from email handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.twitterProfileHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)
        if (validate.emailValidator(message)) {
            await updateInfo({ chat_id: chatId }, { "UserInfo.email": message })
            await sendMessage(chatId, language.askForTwitterProfile);
            await flowPathIndicator.set(chatId, "4")
        } else {
            //wrong email address
            await sendMessage(chatId, language.invalidEmail)
        }


    } catch (err) {
        logger.error(`Error from twitter handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.redditProfileHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)
        if (await urlVerifier(message, "twitter")) {
            await updateInfo({ chat_id: chatId }, { "UserInfo.twitter_profile_link": message })
            await sendMessage(chatId, language.askForReddit)
            await flowPathIndicator.set(chatId, "5")
        } else {
            //wrong twitter profile link
            await sendMessage(chatId, language.invalidTwitterProfile)
        }


    } catch (err) {
        logger.error(`Error from reddit handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.discordUsernameHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)
        if (await urlVerifier(message, "reddit")) {
            await updateInfo({ chat_id: chatId }, { "UserInfo.reddit_username": message })
            await sendMessage(chatId, language.askForDiscordUserName)
            await flowPathIndicator.set(chatId, "6")
        } else {
            //wrong reddit profile 
            await sendMessage(chatId, language.invalidReddit)
        }


    } catch (err) {
        logger.error(`Error from discord handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.facebookProfileHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)

        // console.log("From fb handler" + checkDiscordInvitation(chatId).UserInfo.discord_invitation_link)
        if ((checkLevelOneDone(chatId)) === null) {
            updateInfo({ chat_id: chatId }, { completed_level_of_tasks: 0 })
        } else {
            updateInfo({ chat_id: chatId }, { completed_level_of_tasks: 1 })

        }

        if (message.match(/\w+#\d{4}/i)) {
            await updateInfo({ chat_id: chatId }, { "UserInfo.discord_username": message })
            await sendMessageWith2Buttons(chatId, language.askForFacebookProfileLink);
            await flowPathIndicator.set(chatId, "7")
        } else {
            //wrong discord username
            await sendMessage(chatId, language.invalidDiscordUsername)
        }

    } catch (err) {
        logger.error(`Error from discord handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}
exports.instagramProfileHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)
        if (await urlVerifier(message, "facebook") || message === "SKIP THE TASK") {
            if (message === "SKIP THE TASK") {
                await updateInfo({ chat_id: chatId }, { "UserInfo.fb_profile_link": null })
            } else {
                await updateInfo({ chat_id: chatId }, { "UserInfo.fb_profile_link": message })
            }
            await sendMessageWith2Buttons(chatId, language.askForInstagramProfileLink);
            await flowPathIndicator.set(chatId, "8")

        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(chatId, language.askForWalletAddress);
            await flowPathIndicator.set(chatId, "20")
        } else {

            //wrong facebook profile link
            await sendMessage(chatId, language.invalidFacebookUsername)
        }

    } catch (err) {
        logger.error(`Error from instagram handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.discordInvitationHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)
        if (await urlVerifier(message, "instagram") || message === "SKIP THE TASK") {
            if (message === "SKIP THE TASK") {
                await updateInfo({ chat_id: chatId }, { "UserInfo.insta_profile_link": null })

            } else {
                await updateInfo({ chat_id: chatId }, { "UserInfo.insta_profile_link": message })

            }
            await sendMessageWith2Buttons(chatId, language.askForDiscordInvitationLink)
            await flowPathIndicator.set(chatId, "9")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(chatId, language.askForWalletAddress);
            await flowPathIndicator.set(chatId, "20")
        } else {

            //wrong instagram username
            await sendMessage(chatId, language.invalidInstagramUsername)
        }


    } catch (err) {
        logger.error(`Error from discord invititaion handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.telegramUsernamesHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)
        if (await urlVerifier(message, "discord") || message === "SKIP THE TASK") {
            if (message === "SKIP THE TASK") {
                await updateInfo({ chat_id: chatId }, { "UserInfo.discord_invitation_link": null })
            } else {
                await updateInfo({ chat_id: chatId }, { "UserInfo.discord_invitation_link": message })
            }
            await sendMessageWith2Buttons(chatId, language.askForTelegramUserNames);
            await sendMessage(chatId, language.askForFirstUserName)
            await flowPathIndicator.set(chatId, "10");
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(chatId, language.askForWalletAddress);
            await flowPathIndicator.set(chatId, "20")
        } else {
            await sendMessage(chatId, language.invalidDiscordInvitationLink)
        }

    } catch (err) {
        logger.error(`Error from telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.firstTelegramUserHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)
        if (message.startsWith("@")) {
            await updateInfo({ chat_id: chatId }, { "InvitedTelegramUsers.firstUser": message })
            await sendMessageWithOneButton(chatId, language.askForSecondUserName)
            await flowPathIndicator.set(chatId, "11")
        } else if (message === "SKIP THE TASK") {
            await sendMessageWith2Buttons(chatId, language.askForTwitterUserNames)
            await sendMessage(chatId, language.askForFirstTwitterUser)
            await flowPathIndicator.set(chatId, "15")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(chatId, language.askForWalletAddress);
            await flowPathIndicator.set(chatId, "20")
        } else {
            await sendMessage(chatId, language.wrongAnswer)
        }
    } catch (err) {
        logger.error(`Error from telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.secondTelegramUserHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)
        if (message.startsWith("@")) {
            await updateInfo({ chat_id: chatId }, { "InvitedTelegramUsers.secondUser": message })
            await sendMessageWithOneButton(chatId, language.askForThirdUserName)
            await flowPathIndicator.set(chatId, "12")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(chatId, language.askForWalletAddress);
            await flowPathIndicator.set(chatId, "20")
        } else {
            await sendMessage(chatId, language.wrongAnswer)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }

}

exports.thirdTelegramUserHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)
        if (message.startsWith("@")) {
            await updateInfo({ chat_id: chatId }, { "InvitedTelegramUsers.thirdUser": message })
            await sendMessageWithOneButton(chatId, language.askForForthUserName)
            await flowPathIndicator.set(chatId, "13")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(chatId, language.askForWalletAddress);
            await flowPathIndicator.set(chatId, "20")
        } else {
            await sendMessage(chatId, language.wrongAnswer)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }

}
exports.forthTelegramUserHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)
        if (message.startsWith("@")) {
            await updateInfo({ chat_id: chatId }, { "InvitedTelegramUsers.forthUser": message })
            await sendMessageWithOneButton(chatId, language.askForFifthUserName)
            await flowPathIndicator.set(chatId, "14")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(chatId, language.askForWalletAddress);
            await flowPathIndicator.set(chatId, "20")
        } else {
            await sendMessage(chatId, language.wrongAnswer)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }

}

exports.twitterUsernamesHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)
        if (message.startsWith("@")) {
            await sendMessageWith2Buttons(chatId, language.askForTwitterUserNames)
            await sendMessage(chatId, language.askForFirstTwitterUser)
            await flowPathIndicator.set(chatId, "15")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(chatId, language.askForWalletAddress);
            await flowPathIndicator.set(chatId, "20")
        } else if (message === "SKIP THE TASK") {

        } else {
            await sendMessage(chatId, language.wrongAnswer)
        }

    } catch (err) {
        logger.error(`Error from twitter user names handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}


exports.firstTwitterUserHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)
        if (await urlVerifier(message, "twitter")) {
            await updateInfo({ chat_id: chatId }, { "InvitedTwitterUsers.firstTwitterUser": message })

            await sendMessageWithOneButton(chatId, language.askForSecondTwitterUser)
            await flowPathIndicator.set(chatId, "16")
        } else if (message === "ENTER YOUR WALLET ADDRESS" || message === "SKIP THE TASK") {
            await sendMessage(chatId, language.askForWalletAddress);
            await flowPathIndicator.set(chatId, "20")
        } else {
            await sendMessage(chatId, language.wrongAnswer)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }

}
exports.secondTwitterUserHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)
        if (await urlVerifier(message, "twitter")) {
            await updateInfo({ chat_id: chatId }, { "InvitedTwitterUsers.secondTwitterUser": message })

            await sendMessageWithOneButton(chatId, language.askForThirdTwitterUser)
            await flowPathIndicator.set(chatId, "17")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(chatId, language.askForWalletAddress);
            await flowPathIndicator.set(chatId, "20")
        } else {
            await sendMessage(chatId, language.wrongAnswer)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }

}
exports.thirdTwitterUserHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)
        if (await urlVerifier(message, "twitter")) {
            await updateInfo({ chat_id: chatId }, { "InvitedTwitterUsers.thirdTwitterUser": message })

            await sendMessageWithOneButton(chatId, language.askForForthTwitterUser)
            await flowPathIndicator.set(chatId, "18")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(chatId, language.askForWalletAddress);
            await flowPathIndicator.set(chatId, "20")
        } else {
            await sendMessage(chatId, language.wrongAnswer)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }

}
exports.forthTwitterUserHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)
        if (await urlVerifier(message, "twitter")) {
            await updateInfo({ chat_id: chatId }, { "InvitedTwitterUsers.forthTwitterUser": message })

            await sendMessageWithOneButton(chatId, language.askForFifthTwitterUser)
            await flowPathIndicator.set(chatId, "19")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(chatId, language.askForWalletAddress);
            await flowPathIndicator.set(chatId, "20")
        } else {
            await sendMessage(chatId, language.wrongAnswer)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }

}

exports.walletAddressHandler = async(chatId, message) => {
    try {
        const language = await languageChooser(chatId)
        if (await urlVerifier(message, "twitter")) {
            await updateInfo({ chat_id: chatId }, { "InvitedTwitterUsers.fifthTwitterUser": message })

            await sendMessage(chatId, language.askForWalletAddress);
            await flowPathIndicator.set(chatId, "20");
        } else {
            await sendMessage(chatId, language.wrongAnswer)

        }

    } catch (err) {
        logger.error(`Error from wallet address handler, ${language.somethingWentWrong}`);
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.thankYouHandler = async(chatId, message) => {
    try {

        const language = await languageChooser(chatId)
        await sendMessage(chatId, language.thankYouMessage)
        await updateInfo({ chat_id: chatId }, { is_participated: true }, { "UserInfo.wallet_wallet_address": message })
        if (await checkUserFbProfile(chatId) !== null && await checkUserInstaProfile(chatId) !== null && await checkDiscordInvitation(chatId) !== null) {
            await updateInfo({ chat_id: chatId }, { completed_level_of_tasks: 2 })
        }
        console.log("From thank you" + await checkUserFbProfile(chatId))
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })

    } catch (err) {
        const language = await languageChooser(chatId)

        logger.error(`Error from thank you handler, ${language.somethingWentWrong}`);
        console.log(err.message)
        clearFlags(chatId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}