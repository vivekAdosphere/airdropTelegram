const english = require("../language/english")
const mapNames = require("../config/mapNames")
const { MapToLocal } = require("../functionality/mapToLocal")

const selectedCommunicationLanguage = new MapToLocal(mapNames.selectedCommunicationLanguage)

module.exports = async(senderId) => {
    if (await selectedCommunicationLanguage.has(senderId) && await selectedCommunicationLanguage.get(senderId) === "1") {
        return english
    } else {
        return english
    }
}