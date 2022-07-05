const mapNames = require("../config/mapNames");
const logger = require("../functionality/logger");
const { MapToLocal } = require("../functionality/mapToLocal");
const languageChooser = require('../language/languageChooser');
const {
    sendMessage,
    sendMessageWithTaskButtons,
    sendMessageWith2Buttons,
    sendWalletAddressButton
} = require("../functionality/messageSender");
const {
    clearFlags,
    urlVerifier,
} = require("../functionality/utilities");
const {
    saveUserDetail,
    updateInfo,
    checkIfUserIsregistered,
    checkLevelOneDone,
    checkUserFbProfile,
    checkUserInstaProfile,
    checkDiscordInvitation,
    checkAllTelegramUsers,
    checkAllTwitterUser,
    findAllValues
} = require("../functionality/service")
const flowPathIndicator = new MapToLocal(mapNames.flowPathIndicator);
const userData = new MapToLocal(mapNames.userData);
const validate = require("validation-master")

//flagupdator
let userDataFlagHandler = async(userId, key, value) => {
    try {
        let dictValues = await userData.get(userId, value)
        dictValues[key] = value
        await userData.set(userId, dictValues)
        return;
    } catch (err) {
        throw err
    }
}

let generateOneRandom = async(userId) => {
    try {
        let num1 = Math.ceil(20 * Math.random(0, 20));
        await userDataFlagHandler(userId, "num1", num1)
        return num1
    } catch (err) {
        throw err
    }
}

let generateTwoRandom = async(userId) => {
    try {
        let num2 = Math.ceil(30 * Math.random(0, 40));
        await userDataFlagHandler(userId, "num2", num2)
        return num2
    } catch (err) {
        throw err
    }
}

let captcha = (num1, num2) => {
    let answer = num1 + num2;
    return answer;
}



let initDefaultValues = async(userId, index) => {
    try {
        await flowPathIndicator.set(userId, index)
        await userData.set(userId, {})
    } catch (err) {
        throw err
    }
}



exports.startHandler = async(userId) => {
    try {
        const language = await languageChooser(userId)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })

        if (await checkIfUserIsregistered(userId)) {
            await updateInfo({ user_id: userId })
        } else {
            await saveUserDetail({ user_id: userId })
        }
        await initDefaultValues(userId, "1");
        await sendMessage(userId, `${language.welcomeMessage}: ${await generateOneRandom(userId)} + ${await generateTwoRandom(userId)} `);


    } catch (err) {
        const language = await languageChooser(userId)
        logger.error(`Error from start handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}


exports.answerHandler = async(userId, message, firstName, lastName) => {
    const language = await languageChooser(userId)

    try {

        await updateInfo({ chat_id: userId }, { "UserInfo.name": firstName + lastName })
        if (message == captcha((await userData.get(userId)).num1, (await userData.get(userId)).num2)) {
            sendMessageWithTaskButtons(userId, `👍 That 's correct, <b>${firstName}</b>\n` + language.taskList)
            await flowPathIndicator.set(userId, "2")
        } else {
            await sendMessage(userId, language.wrongAnswer);
            await sendMessage(userId, `${await generateOneRandom(userId)} + ${await generateTwoRandom(userId)} =`);
        }


    } catch (err) {
        logger.error(`Error from answer handler , ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.emailHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {
        await sendMessage(userId, language.askForEmail)
        await flowPathIndicator.set(userId, "3")
    } catch (err) {
        logger.error(`Error from email handler, ${language.somethingWentWrong}`);
        console.log(err.message)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.twitterProfileHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (validate.emailValidator(message)) {
            await updateInfo({ chat_id: userId }, { "UserInfo.email": message })
            await sendMessage(userId, language.askForTwitterProfile);
            await flowPathIndicator.set(userId, "4")
        } else {
            //wrong email address
            await sendMessage(userId, language.invalidEmail)
        }


    } catch (err) {
        logger.error(`Error from twitter handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.redditProfileHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {
        if (await urlVerifier(message, "twitter")) {
            await updateInfo({ chat_id: userId }, { "UserInfo.twitter_profile_link": message })
            await sendMessage(userId, language.askForReddit)
            await flowPathIndicator.set(userId, "5")
        } else {
            //wrong twitter profile link
            await sendMessage(userId, language.invalidTwitterProfile)
        }


    } catch (err) {
        logger.error(`Error from reddit handler, ${language.somethingWentWrong}`);
        console.log(err.message)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.discordUsernameHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {
        if (await urlVerifier(message, "reddit")) {
            await updateInfo({ chat_id: userId }, { "UserInfo.reddit_username": message })
            await sendMessage(userId, language.askForDiscordUserName)
            await flowPathIndicator.set(userId, "6")
        } else {
            //wrong reddit profile 
            await sendMessage(userId, language.invalidReddit)
        }


    } catch (err) {
        logger.error(`Error from discord handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.facebookProfileHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {

        // console.log("From fb handler" + checkDiscordInvitation(userId).UserInfo.discord_invitation_link)
        if ((checkLevelOneDone(userId)) !== null) {
            updateInfo({ chat_id: userId }, { completed_level_of_tasks: 1 })
        }
        if (message.match(/\w+#\d{4}/i)) {
            await updateInfo({ chat_id: userId }, { "UserInfo.discord_username": message })
            await sendMessageWith2Buttons(userId, language.askForFacebookProfileLink);
            await flowPathIndicator.set(userId, "7")
        } else {
            //wrong discord username
            await sendMessage(userId, language.invalidDiscordUsername)
        }

    } catch (err) {
        logger.error(`Error from discord handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}
exports.instagramProfileHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {
        if (await urlVerifier(message, "facebook") || message === "SKIP THE TASK") {
            if (message === "SKIP THE TASK") {
                await updateInfo({ chat_id: userId }, { "UserInfo.fb_profile_link": null })
            } else {
                await updateInfo({ chat_id: userId }, { "UserInfo.fb_profile_link": message })
            }
            await sendMessageWith2Buttons(userId, language.askForInstagramProfileLink);
            await flowPathIndicator.set(userId, "8")

        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {

            //wrong facebook profile link
            await sendMessage(userId, language.invalidFacebookUsername)
        }

    } catch (err) {
        logger.error(`Error from instagram handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.discordInvitationHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {
        if (await urlVerifier(message, "instagram") || message === "SKIP THE TASK") {
            if (message === "SKIP THE TASK") {
                await updateInfo({ chat_id: userId }, { "UserInfo.insta_profile_link": null })

            } else {
                await updateInfo({ chat_id: userId }, { "UserInfo.insta_profile_link": message })

            }
            await sendMessageWith2Buttons(userId, language.askForDiscordInvitationLink)
            await flowPathIndicator.set(userId, "9")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {

            //wrong instagram username
            await sendMessage(userId, language.invalidInstagramUsername)
        }


    } catch (err) {
        logger.error(`Error from discord invititaion handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.telegramUsernamesHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {
        if (await urlVerifier(message, "discord") || message === "SKIP THE TASK") {
            if (message === "SKIP THE TASK") {
                await updateInfo({ chat_id: userId }, { "UserInfo.discord_invitation_link": null })
            } else {
                await updateInfo({ chat_id: userId }, { "UserInfo.discord_invitation_link": message })
            }
            await sendMessageWith2Buttons(userId, language.askForTelegramUserNames);
            await sendMessage(userId, language.askForFirstUserName)
            await flowPathIndicator.set(userId, "10");
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidDiscordInvitationLink)
        }

    } catch (err) {
        logger.error(`Error from telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.firstTelegramUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {
        if (message.startsWith("@")) {
            await updateInfo({ chat_id: userId }, { "InvitedTelegramUsers.firstUser": message })
            await sendWalletAddressButton(userId, language.askForSecondUserName)
            await flowPathIndicator.set(userId, "11")
        } else if (message === "SKIP THE TASK") {
            await sendMessageWith2Buttons(userId, language.askForTwitterUserNames)
            await sendMessage(userId, language.askForFirstTwitterUser)
            await flowPathIndicator.set(userId, "15")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTelegramUserName)
        }
    } catch (err) {
        logger.error(`Error from telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.secondTelegramUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {
        if (message.startsWith("@")) {
            await updateInfo({ chat_id: userId }, { "InvitedTelegramUsers.secondUser": message })
            await sendWalletAddressButton(userId, language.askForThirdUserName)
            await flowPathIndicator.set(userId, "12")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTelegramUserName)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }

}

exports.thirdTelegramUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {
        if (message.startsWith("@")) {
            await updateInfo({ chat_id: userId }, { "InvitedTelegramUsers.thirdUser": message })
            await sendWalletAddressButton(userId, language.askForForthUserName)
            await flowPathIndicator.set(userId, "13")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTelegramUserName)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }

}
exports.forthTelegramUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {
        if (message.startsWith("@")) {
            await updateInfo({ chat_id: userId }, { "InvitedTelegramUsers.forthUser": message })
            await sendWalletAddressButton(userId, language.askForFifthUserName)
            await flowPathIndicator.set(userId, "14")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTelegramUserName)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }

}

exports.twitterUsernamesHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {
        if (message.startsWith("@")) {
            await updateInfo({ chat_id: userId }, { "InvitedTelegramUsers.fifthUser": message })
            await sendMessageWith2Buttons(userId, language.askForTwitterUserNames)
            await sendMessage(userId, language.askForFirstTwitterUser)
            await flowPathIndicator.set(userId, "15")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTelegramUserName)
        }

    } catch (err) {
        logger.error(`Error from twitter user names handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}


exports.firstTwitterUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {
        if (await urlVerifier(message, "twitter")) {
            await sendWalletAddressButton(userId, language.askForSecondTwitterUser)
            await updateInfo({ chat_id: userId }, { "InvitedTwitterUsers.firstTwitterUser": message })
            await flowPathIndicator.set(userId, "16")
        } else if (message === "ENTER YOUR WALLET ADDRESS" || message === "SKIP THE TASK") {
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTwitterProfile)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }

}
exports.secondTwitterUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {
        if (await urlVerifier(message, "twitter")) {
            await updateInfo({ chat_id: userId }, { "InvitedTwitterUsers.secondTwitterUser": message })

            await sendWalletAddressButton(userId, language.askForThirdTwitterUser)
            await flowPathIndicator.set(userId, "17")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTwitterProfile)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }

}
exports.thirdTwitterUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {
        if (await urlVerifier(message, "twitter")) {
            await updateInfo({ chat_id: userId }, { "InvitedTwitterUsers.thirdTwitterUser": message })

            await sendWalletAddressButton(userId, language.askForForthTwitterUser)
            await flowPathIndicator.set(userId, "18")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTwitterProfile)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }

}
exports.forthTwitterUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {
        if (await urlVerifier(message, "twitter")) {
            await updateInfo({ chat_id: userId }, { "InvitedTwitterUsers.forthTwitterUser": message })

            await sendWalletAddressButton(userId, language.askForFifthTwitterUser)
            await flowPathIndicator.set(userId, "19")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTwitterProfile)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }

}

exports.walletAddressHandler = async(userId, message) => {
    const language = await languageChooser(userId)

    try {
        if (await urlVerifier(message, "twitter")) {
            await updateInfo({ chat_id: userId }, { "InvitedTwitterUsers.fifthTwitterUser": message })

            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20");
        } else {
            await sendMessage(userId, language.invalidTwitterProfile)

        }

    } catch (err) {
        logger.error(`Error from wallet address handler, ${language.somethingWentWrong}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

exports.thankYouHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        await sendMessage(userId, language.thankYouMessage)
        await updateInfo({ chat_id: userId }, { is_participated: true }, { "UserInfo.wallet_wallet_address": message })
        if (await checkUserFbProfile(userId) !== null && await checkUserInstaProfile(userId) !== null && await checkDiscordInvitation(userId) !== null) {
            if (await checkAllTelegramUsers(userId) !== null && await checkAllTwitterUser(userId) !== null) {
                await updateInfo({ chat_id: userId }, { completed_level_of_tasks: 3 })

            } else {
                await updateInfo({ chat_id: userId }, { completed_level_of_tasks: 2 })

            }
        }
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })

    } catch (err) {

        logger.error(`Error from thank you handler, ${language.somethingWentWrong}`);
        console.log(err.message)
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}