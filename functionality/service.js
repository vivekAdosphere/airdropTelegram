const User = require("../models/userDetails");
const logger = require("./logger");

/**
 * @description save user details to database
 * @param {Object} dataObject 
 */
exports.saveUserDetail = async(dataObject) => {
    try {
        const user = await User.create(dataObject)
    } catch (err) {
        console.log(err)
        throw new Error(err.message)
    }
}

/**
 * @description update userinfo for a particular userId
 * @param {Number} userId unique id of chat user
 * @param {Object} dataObject dataObject to be updated
 * @returns user from db
 */
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

/**
 * @description to check user is already in database or not
 * @param {Number} userId unique id of chat user
 * @returns user 
 */
exports.checkIfUserIsregistered = async(userId) => {
    try {
        const user = await User.findOne({ user_id: userId })
        return user.user_id

    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}


/**
 * @description to check users discrod user name for a specific usrId
 * @param {Number} userId unique id of chat user
 * @returns users discord name
 */

exports.checkLevelOneDone = async(userId) => {
    try {
        const user = await User.findOne({ user_id: userId })
        return user.UserInfo.discord_username
    } catch (err) {
        logger.error(`DB Fetch error from check level done---> ${JSON.stringify(err)}`)
        return false
    }
}

/**
 * @description to check user has enterd all telegram usernames
 * @param {Number} userId unique id of chat user
 * @returns fifth telegram username
 */

exports.checkAllTelegramUsers = async(userId) => {
    try {
        const user = await User.findOne({ user_id: userId })
        return user.InvitedTelegramUsers.fifthUser
    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err.message)}`)
        return false
    }
}

/**
 * @description check user has entered fb profile link or not
 * @param {Number} userId unique id of chat user
 * @returns users fb profile or null
 */
exports.checkUserFbProfile = async(userId) => {
    try {
        const user = await User.findOne({ user_id: userId })
        return user ? user.UserInfo.fb_profile_link : user
    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}

/**
 * @description to check user has entered insta profile or not
 * @param {Number} userId unique id of chat user
 * @returns insta profile of a user or null
 */
exports.checkUserInstaProfile = async(userId) => {
    try {
        const user = await User.findOne({ user_id: userId })
        return user ? user.UserInfo.insta_profile_link : user
    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}

/**
 * @description to check user has entered discord invitation link or not
 * @param {Number} userId unique id of chat user
 * @returns discord link or null
 */
exports.checkDiscordInvitation = async(userId) => {
    try {
        const user = await User.findOne({ user_id: userId })
        return user ? UserInfo.discord_invitationv_link : user
    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}

/**
 * @description to check user has entered all twitter or not
 * @param {Number} userId unique id of chat user
 * @returns fifth twitter user profile
 */
exports.checkAllTwitterUser = async(userId) => {
    try {
        const user = await User.findOne({ user_id: userId })
        return user.InvitedTwitterUsers.fifthTwitterUser
    } catch (err) {
        logger.error(`DB Fetch Error from checking---> ${JSON.stringify(err)}`)
        return false
    }
}