const moment = require("moment");
const { MapToLocal } = require("./mapToLocal");
const mapNames = require("../config/mapNames");
const axios = require("axios");

const selectedCommunicationLanguage = new MapToLocal(mapNames.selectedCommunicationLanguage);
const userData = new MapToLocal(mapNames.userData)
const flowPathIndicator = new MapToLocal(mapNames.flowPathIndicator)

exports.clearFlags = (number) => {
    if (flowPathIndicator.has(number)) {
        flowPathIndicator.delete(number)
    }
    if (userData.has(number)) {
        userData.delete(number);
    }
    if (selectedCommunicationLanguage.has(number)) {
        selectedCommunicationLanguage.delete(number)
    }

}

exports.getCurrentTime = () => {
    let dateAndTime = moment().utcOffset(330)
    return dateAndTime.format()
}

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




exports.urlVerifier = async(url, socialMedia) => {
    try {
        url = url.toLowerCase()
        socialMedia = socialMedia.toLowerCase()
        const validUrlRegex = /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi

        if (url && url.startsWith("https://") && validUrlRegex.test(url) && url.includes(socialMedia)) {
            let isValidPathname = false
            let urlObject = new URL(url)

            if (urlObject.pathname !== "/") {
                let pathName = urlObject.pathname;
                console.log(pathName, typeof pathName)
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
                        // console.log(searchParams.has("id"), typeof searchParams)
                        // isValidPathname = (pathName.includes("/profile") && searchParams.has("id")) || pathName.match(/^[a-z\d.]{5,}$/i)
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
                }
            }

            if (isValidPathname) {
                const res = await axios.get(url)
                if (res.status === 200) {
                    return true
                }
            }
        }

        return false
    } catch (err) {
        console.log(err)
        return false
    }
}