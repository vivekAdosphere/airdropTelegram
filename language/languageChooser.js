const english = require("../language/english")
const mapNames = require("../config/mapNames")
const { MapToLocal } = require("../functionality/mapToLocal")

const selectedCommunicationLanguage = new MapToLocal(mapNames.selectedCommunicationLanguage)

module.exports = (senderId) => {
    if (selectedCommunicationLanguage.has(senderId) && selectedCommunicationLanguage.get(senderId) === "1") {
        return english
    } else {
        return english
    }
}