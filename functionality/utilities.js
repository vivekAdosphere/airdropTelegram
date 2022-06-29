const moment = require("moment");
const { MapToLocal } = require("./mapToLocal");
const mapNames = require("../config/mapNames")

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