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

/**
 * @description this function is used to store user data by using map functionality
 * @param {Number} userId  unique id of chat user
 * @param {String} key unique key to store unique value
 * @param {String} value value for different keys
 * @returns void
 */
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

/**
 * @description this function is used to generate random number
 * @param {Number} userId  unique id of chat user
 * @returns {Number} random number
 */

let generateOneRandom = async(userId) => {
    try {
        let num1 = Math.ceil(20 * Math.random(0, 20));
        await userDataFlagHandler(userId, "num1", num1)
        return num1
    } catch (err) {
        throw err
    }
}

/**
 * @description this function is used to generate random number
 * @param {Number} userId  unique id of chat user
 * @returns {Number} random number
 */

let generateTwoRandom = async(userId) => {
    try {
        let num2 = Math.ceil(30 * Math.random(0, 40));
        await userDataFlagHandler(userId, "num2", num2)
        return num2
    } catch (err) {
        throw err
    }
}

/**
 * @description this function is used to sum two random numbers
 * @param {Number} num1 
 * @param {Number} num2 
 * @returns {Number} the sum of num1 and num2
 */

let captcha = (num1, num2) => {
    let answer = num1 + num2;
    return answer;
}

/**
 * @description this function is used to initialize the flowpath indicator and userdata maps
 * @param {Number} userId unique id of user chat
 * @param {String} index index to initialize map funciton
 */
let initDefaultValues = async(userId, index) => {
    try {
        await flowPathIndicator.set(userId, index)
        await userData.set(userId, {})
    } catch (err) {
        throw err
    }
}

/**
 * @description this function revokes when user enters /start command in chat
 * @param {Number} userId unique id of user chat
 */
exports.startHandler = async(userId) => {
    const language = await languageChooser(userId)
    try {
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
        logger.error(`Error from start handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description this function revokes when user answers for the captch and flowpath is set to "1"
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 * @param {String} firstName frist name of the user
 * @param {String} lastName last name of the user
 */
exports.answerHandler = async(userId, message, firstName, lastName) => {

    const language = await languageChooser(userId)
    try {
        await updateInfo({ user_id: userId }, { "UserInfo.name": firstName + lastName })
        if (message == captcha((await userData.get(userId)).num1, (await userData.get(userId)).num2)) {
            sendMessageWithTaskButtons(userId, `👍 That 's correct, <b>${firstName}</b>\n` + language.taskList)
            await flowPathIndicator.set(userId, "2")
        } else {
            await sendMessage(userId, language.wrongAnswer);
            await sendMessage(userId, `${await generateOneRandom(userId)} + ${await generateTwoRandom(userId)} =`);
        }
    } catch (err) {
        logger.error(`Error from answer handler , ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description this function is used to validate email message and ask for twitter profile
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.emailHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (validate.emailValidator(message)) {
            await updateInfo({ user_id: userId }, { "UserInfo.email": message })
            await sendMessage(userId, language.askForTwitterProfile);
            await flowPathIndicator.set(userId, "4")
        } else {
            //wrong email address
            await sendMessage(userId, language.invalidEmail)
        }
    } catch (err) {
        logger.error(`Error from email handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description used to validate twitter profile and then ask for reddit profile
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.twitterProfileHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (await urlVerifier(message, "twitter")) {
            await updateInfo({ user_id: userId }, { "UserInfo.twitter_profile_link": message })
            await sendMessage(userId, language.askForReddit)
            await flowPathIndicator.set(userId, "5")
        } else {
            //wrong twitter profile link
            await sendMessage(userId, language.invalidTwitterProfile)
        }
    } catch (err) {
        logger.error(`Error from twitter handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description used to validate reddit profile and then ask for discord username
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */

exports.redditProfileHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (await urlVerifier(message, "reddit")) {
            await updateInfo({ user_id: userId }, { "UserInfo.reddit_username": message })
            await sendMessage(userId, language.askForDiscordUserName)
            await flowPathIndicator.set(userId, "6")
        } else {
            //wrong reddit profile 
            await sendMessage(userId, language.invalidReddit)
        }
    } catch (err) {
        logger.error(`Error from reddit handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description used to validate discord username and then ask for fb profile link
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.discordUsernameHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {

        if (message.match(/^.{3,32}#[0-9]{4}$/)) {
            await updateInfo({ user_id: userId }, { "UserInfo.discord_username": message })
            await sendMessageWith2Buttons(userId, language.askForFacebookProfileLink);
            await flowPathIndicator.set(userId, "7")
            if ((await checkLevelOneDone(userId)) !== null) {
                await updateInfo({ user_id: userId }, { completed_level_of_tasks: 1 })
            }
        } else {
            //wrong discord username
            await sendMessage(userId, language.invalidDiscordUsername)
        }
    } catch (err) {
        logger.error(`Error from discord handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description used to validate fb profile and then ask for insta profile link
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.facebookProfileHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (await urlVerifier(message, "facebook") || message === "SKIP THE TASK") {
            if (message === "SKIP THE TASK") {
                await updateInfo({ user_id: userId }, { "UserInfo.fb_profile_link": null })
            } else {
                await updateInfo({ user_id: userId }, { "UserInfo.fb_profile_link": message })
            }
            await sendMessageWith2Buttons(userId, language.askForInstagramProfileLink);
            await flowPathIndicator.set(userId, "8")

        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await updateInfo({ user_id: userId }, { "UserInfo.fb_profile_link": null })
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidFacebookUsername)
        }
    } catch (err) {
        logger.error(`Error from discord handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description used to validate insta profile then ask for discord invitaion link
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.instagramProfileHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (await urlVerifier(message, "instagram") || message === "SKIP THE TASK") {
            if (message === "SKIP THE TASK") {
                await updateInfo({ user_id: userId }, { "UserInfo.insta_profile_link": null })
            } else {
                await updateInfo({ user_id: userId }, { "UserInfo.insta_profile_link": message })
            }
            await sendMessageWith2Buttons(userId, language.askForDiscordInvitationLink)
            await flowPathIndicator.set(userId, "9")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await updateInfo({ user_id: userId }, { "UserInfo.insta_profile_link": null })
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidInstagramUsername)
        }
    } catch (err) {
        logger.error(`Error from instagram handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description used to validate discord link then ask for telegram usernames
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.discordInvitationHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (await urlVerifier(message, "discord") || message === "SKIP THE TASK") {
            if (message === "SKIP THE TASK") {
                await updateInfo({ user_id: userId }, { "UserInfo.discord_invitation_link": null })
            } else {
                await updateInfo({ user_id: userId }, { "UserInfo.discord_invitation_link": message })
            }
            await sendMessageWith2Buttons(userId, language.askForTelegramUserNames);
            await sendMessage(userId, language.askForFirstUserName)
            await flowPathIndicator.set(userId, "10");
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await updateInfo({ user_id: userId }, { "UserInfo.discord_invitation_link": null })
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidDiscordInvitationLink)
        }
    } catch (err) {
        logger.error(`Error from discord invititaion handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description used to validate telegram username
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.firstTelegramUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (message.startsWith("@")) {
            await updateInfo({ user_id: userId }, { "InvitedTelegramUsers.firstUser": message })
            await sendWalletAddressButton(userId, language.askForSecondUserName)
            await flowPathIndicator.set(userId, "11")
        } else if (message === "SKIP THE TASK") {
            await updateInfo({ user_id: userId }, { "InvitedTelegramUsers.firstUser": null })

            await sendMessageWith2Buttons(userId, language.askForTwitterUserNames)
            await sendMessage(userId, language.askForFirstTwitterUser)
            await flowPathIndicator.set(userId, "15")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await updateInfo({ user_id: userId }, { "InvitedTelegramUsers.firstUser": null })
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTelegramUserName)
        }
    } catch (err) {
        logger.error(`Error from telegram usernames handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}


/**
 * @description used to validate telegram username
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.secondTelegramUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (message.startsWith("@")) {
            await updateInfo({ user_id: userId }, { "InvitedTelegramUsers.secondUser": message })
            await sendWalletAddressButton(userId, language.askForThirdUserName)
            await flowPathIndicator.set(userId, "12")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await updateInfo({ user_id: userId }, { "InvitedTelegramUsers.secondUser": null })
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTelegramUserName)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description used to validate telegram username
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.thirdTelegramUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (message.startsWith("@")) {
            await updateInfo({ user_id: userId }, { "InvitedTelegramUsers.thirdUser": message })
            await sendWalletAddressButton(userId, language.askForForthUserName)
            await flowPathIndicator.set(userId, "13")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await updateInfo({ user_id: userId }, { "InvitedTelegramUsers.thirdUser": null })
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTelegramUserName)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }

}

/**
 * @description used to validate telegram username
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.forthTelegramUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (message.startsWith("@")) {
            await updateInfo({ user_id: userId }, { "InvitedTelegramUsers.forthUser": message })
            await sendWalletAddressButton(userId, language.askForFifthUserName)
            await flowPathIndicator.set(userId, "14")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await updateInfo({ user_id: userId }, { "InvitedTelegramUsers.forthUser": null })

            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTelegramUserName)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description used to validate telegram username and then ask for twitter usernames
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.fifthTelegramUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (message.startsWith("@")) {
            await updateInfo({ user_id: userId }, { "InvitedTelegramUsers.fifthUser": message })
            await sendMessageWith2Buttons(userId, language.askForTwitterUserNames)
            await sendMessage(userId, language.askForFirstTwitterUser)
            await flowPathIndicator.set(userId, "15")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await updateInfo({ user_id: userId }, { "InvitedTelegramUsers.fifthUser": null })
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTelegramUserName)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}


/**
 * @description used to validate twitter username
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.firstTwitterUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (await urlVerifier(message, "twitter")) {
            await sendWalletAddressButton(userId, language.askForSecondTwitterUser)
            await updateInfo({ user_id: userId }, { "InvitedTwitterUsers.firstTwitterUser": message })
            await flowPathIndicator.set(userId, "16")
        } else if (message === "ENTER YOUR WALLET ADDRESS" || message === "SKIP THE TASK") {
            await updateInfo({ user_id: userId }, { "InvitedTwitterUsers.firstTwitterUser": null })
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTwitterProfile)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }

}

/**
 * @description used to validate twitter username
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.secondTwitterUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (await urlVerifier(message, "twitter")) {
            await updateInfo({ user_id: userId }, { "InvitedTwitterUsers.secondTwitterUser": message })
            await sendWalletAddressButton(userId, language.askForThirdTwitterUser)
            await flowPathIndicator.set(userId, "17")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await updateInfo({ user_id: userId }, { "InvitedTwitterUsers.secondTwitterUser": null })

            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTwitterProfile)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${err.message}}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description used to validate twitter username
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.thirdTwitterUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (await urlVerifier(message, "twitter")) {
            await updateInfo({ user_id: userId }, { "InvitedTwitterUsers.thirdTwitterUser": message })
            await sendWalletAddressButton(userId, language.askForForthTwitterUser)
            await flowPathIndicator.set(userId, "18")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await updateInfo({ user_id: userId }, { "InvitedTwitterUsers.thirdTwitterUser": null })
            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTwitterProfile)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}

/**
 * @description used to validate twitter username
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.forthTwitterUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (await urlVerifier(message, "twitter")) {
            await updateInfo({ user_id: userId }, { "InvitedTwitterUsers.forthTwitterUser": message })
            await sendWalletAddressButton(userId, language.askForFifthTwitterUser)
            await flowPathIndicator.set(userId, "19")
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await updateInfo({ user_id: userId }, { "InvitedTwitterUsers.forthTwitterUser": null })

            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20")
        } else {
            await sendMessage(userId, language.invalidTwitterProfile)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}


/**
 * @description used to validate twitter username
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.fifthTwitterUserHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        if (await urlVerifier(message, "twitter")) {
            await updateInfo({ user_id: userId }, { "InvitedTwitterUsers.fifthTwitterUser": message })

            await sendMessage(userId, language.askForWalletAddress);
            await flowPathIndicator.set(userId, "20");
        } else if (message === "ENTER YOUR WALLET ADDRESS") {
            await updateInfo({ user_id: userId }, { "InvitedTwitterUsers.fifthTwitterUser": null })
        } else {
            await sendMessage(userId, language.invalidTwitterProfile)
        }
    } catch (err) {
        logger.error(`Error from second telegram usernames handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}


/**
 * @description used to take wallet address and then send thank you message to user
 * @param {Number} userId unique id of user chat
 * @param {String} message text message from user input
 */
exports.walletAddressHandler = async(userId, message) => {
    const language = await languageChooser(userId)
    try {
        console.log(await checkUserFbProfile(userId))
        console.log(await checkUserInstaProfile(userId))
        console.log(await checkDiscordInvitation(userId))
        await sendMessage(userId, language.thankYouMessage)
        await updateInfo({ user_id: userId }, { is_participated: true }, { "UserInfo.wallet_wallet_address": message })
        if (await checkUserFbProfile(userId) !== null && await checkUserInstaProfile(userId) !== null && await checkDiscordInvitation(userId) !== null) {
            if (await checkAllTelegramUsers(userId) !== null && await checkAllTwitterUser(userId) !== null) {
                await updateInfo({ user_id: userId }, { completed_level_of_tasks: 3 })
            } else {
                await updateInfo({ user_id: userId }, { completed_level_of_tasks: 2 })
            }
        }
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    } catch (err) {
        logger.error(`Error from wallet address handler, ${err.message}`);
        clearFlags(userId).catch(err => {
            logger.error(`Error,${err.message}`)
        })
    }
}