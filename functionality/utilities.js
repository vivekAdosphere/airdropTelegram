const moment = require("moment");
const { MapToLocal } = require("./mapToLocal");
const mapNames = require("../config/mapNames");
const axios = require("axios");

const selectedCommunicationLanguage = new MapToLocal(mapNames.selectedCommunicationLanguage);
const userData = new MapToLocal(mapNames.userData)
const flowPathIndicator = new MapToLocal(mapNames.flowPathIndicator)

/**
 * @description this function clear all mapping stored in db for a particular user
 * @param {Number} number unique userid coming from telegram message chat
 */

exports.clearFlags = async(number) => {
    try {
        if (await flowPathIndicator.has(number)) {
            await flowPathIndicator.delete(number)
        }
        if (await userData.has(number)) {
            await userData.delete(number);
        }
        if (await selectedCommunicationLanguage.has(number)) {
            await selectedCommunicationLanguage.delete(number)
        }
    } catch (err) {
        throw err
    }
}

/**
 * @description this function returns the current time
 * @returns current time for the indian region
 */

exports.getCurrentTime = () => {
    let dateAndTime = moment().utcOffset(330)
    return dateAndTime.format()
}


/**
 * @description checks the given date is valid or not
 * @param {String} enteredDate date 
 * @returns {Boolean} is valid date or not
 */

exports.isValidDate = (enteredDate) => {

    const dob = moment(enteredDate, 'DD/MM/YYYY', true)
    const isValidDate = dob.isValid();

    if (isValidDate) {
        const isBeforeToday = dob.clone().isBefore(moment(), "day")

        if (isBeforeToday) {
            return [true, "Success"]
        } else {
            return [false, "Future Date"]
        }
    } else {
        return [false, "Invalid Date"]
    }
}



/**
 * 
 * @description Verifies whether the given social media url is valid or not.
 * @param {String} url URL of social media
 * @param {String} socialMedia Identifier of social media domain
 * @returns {Boolean} Is valid social media
 */

exports.urlVerifier = async(url, socialMedia) => {
    try {
        url = url.toLowerCase()
        socialMedia = socialMedia.toLowerCase()
        let validUrlRegex = /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi

        if (url && url.startsWith("https://") && validUrlRegex.test(url) && url.includes(socialMedia)) {
            let isValidPathname = false
            let urlObject = new URL(url)


            if (urlObject.pathname !== "/") {
                let pathName = urlObject.pathname;
                let searchParams = urlObject.searchParams

                switch (socialMedia) {
                    case "instagram":
                        isValidPathname = true
                        break
                    case "reddit":
                        isValidPathname = pathName.includes("/u/") || pathName.includes("/user/") || pathName.includes("/r/")
                        break
                    case "facebook":
                        if (url.match(/(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]+)(?:\/)?/i)) {
                            isValidPathname = true
                        }
                        break
                    case "twitter":
                        isValidPathname = true
                        break
                    case "discord":
                        isValidPathname = true
                        break
                    case "telegram":
                        if (url.match(/^(?:|(https?:\/\/)?(|www)[.]?((t|telegram)\.me)\/)[a-zA-Z0-9_]{5,32}$/gm)) {
                            isValidPathname = true
                        }
                        break
                    default:
                        isValidPathname = false
                }
            }
            return true

        }
        return false
    } catch (err) {
        logger.error(`Error --> ${err.message}`)
        return false
    }
}