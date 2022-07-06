const logger = require("./logger");
const LocalData = require("../models/LocalData");

class MapToLocal {

    constructor(dbKey) {
        this.dbKey = dbKey
    }

    async set(number, value) {
        try {
            let update = { "$set": {} }
            update["$set"]["number"] = number
            update["$set"]["states." + this.dbKey] = value

            await LocalData.updateOne({ number: number }, update, { upsert: true })
        } catch (e) {
            logger.error(`Error, Database set operation error --> ${JSON.stringify(e)}`);
            return;
        }
    }

    async get(number) {
        try {
            const result = await LocalData.findOne({ number: number })
            if (!result) {
                return undefined;
            } else {
                return result.states.get(this.dbKey);
            }
        } catch (e) {
            logger.error(`Error, Database get operation error-- > ${JSON.stringify(e)}`);
            return undefined;
        }
    }

    async has(number) {
        try {
            const result = await LocalData.findOne({ number: number })
            if (!result) {
                return false;
            } else {
                return result.states.get(this.dbKey) ? true : false;
            }
        } catch (e) {
            logger.error(`Error, Database has operation error-- > ${JSON.stringify(e)}`);
            return false;
        }
    }

    async delete(number) {
        try {
            const result = await LocalData.deleteOne({ number: number })
            if (!result) {
                return false;
            } else {
                return true;
            }
        } catch (e) {
            logger.error(`Error, Database delete operation error-- > ${JSON.stringify(e)}`);
            return false;
        }
    }
}

module.exports = { MapToLocal }