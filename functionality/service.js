const User = require("../models/userDetails");
const logger = require("./logger");


exports.saveUserDetail = async(dataObject) => {
    try {
        const user = await User.create(dataObject)

    } catch (err) {
        console.log(err)
        throw new Error(err.message)
    }
}

exports.updateInfo = async(chatId, dataObject) => {
    try {

        console.log(dataObject)
        const user = await User.updateOne(chatId, dataObject)
        return user
    } catch (err) {
        logger.error(`DB Fetch Error from updating---> ${JSON.stringify(err)}`)
        return false
    }
}

exports.checkIfUserIsregistered = async(chatId) => {
    try {
        const user = await User.findOne({ chat_id: chatId })
        return user

    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}

exports.checkLevelOneDone = async(chatId) => {
    try {
        const user = await User.findOne({ chat_id: chatId }, "UserInfo.discord_username")
        return user
    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}

exports.checkUserFbProfile = async(chatId) => {
    try {
        const user = await User.findOne({ chat_id: chatId })
        return user ? user.UserInfo.fb_profile_link : user
    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}

exports.checkUserInstaProfile = async(chatId) => {
    try {
        const user = await User.findOne({ chat_id: chatId })
        return user ? user.UserInfo.insta_profile_link : user
    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}
exports.checkDiscordInvitation = async(chatId) => {
    try {
        const user = await User.findOne({ chat_id: chatId })
        return user ? UserInfo.discord_invitationv_link : user
    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}