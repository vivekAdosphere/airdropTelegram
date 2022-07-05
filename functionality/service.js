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

exports.updateInfo = async(userId, dataObject) => {
    try {

        console.log(dataObject)
        const user = await User.updateOne(userId, dataObject)
        return user
    } catch (err) {
        logger.error(`DB Fetch Error from updating---> ${JSON.stringify(err)}`)
        return false
    }
}

exports.checkIfUserIsregistered = async(userId) => {
    try {
        const user = await User.findOne({ user_id: userId })
        return user

    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}

exports.checkLevelOneDone = async(userId) => {
    try {
        const user = await User.findOne({ user_id: userId })
        return user ? UserInfo.discord_username : user
    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}

exports.checkAllTelegramUsers = async(userId) => {
    try {
        const user = await User.findOne({ user_id: userId })
        return user.InvitedTwitterUsers.fifthUser
    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}

exports.checkUserFbProfile = async(userId) => {
    try {
        const user = await User.findOne({ user_id: userId })
        return user ? user.UserInfo.fb_profile_link : user
    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}

exports.checkUserInstaProfile = async(userId) => {
    try {
        const user = await User.findOne({ user_id: userId })
        return user ? user.UserInfo.insta_profile_link : user
    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}
exports.checkDiscordInvitation = async(userId) => {
    try {
        const user = await User.findOne({ user_id: userId })
        return user ? UserInfo.discord_invitationv_link : user
    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}

exports.checkAllTwitterUser = async(userId) => {
    try {
        const user = await User.findOne({ user_id: userId })
        return user.InvitedTwitterUsers.fifthUser
    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}