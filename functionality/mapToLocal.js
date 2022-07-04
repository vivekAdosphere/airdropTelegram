// /* Require dependencies */
// const db = require("croxydb");

// class MapToLocal {
//     constructor(dbKey) {
//         this.dbKey = dbKey;
//     }

//     setMap(key, value) {
//         if (db.has(this.dbKey)) { //Existing
//             const createNewMap = new Map(Object.entries(db.get(this.dbKey)));
//             createNewMap.set(key, Object.fromEntries(value));
//             db.delByPriority(this.dbKey, 1);
//             db.set(this.dbKey, Object.fromEntries(createNewMap));
//         } else { //Create New MAP
//             const createNewMap = new Map();
//             createNewMap.set(key, Object.fromEntries(value));
//             db.set(this.dbKey, Object.fromEntries(createNewMap));
//         }
//     }

//     set(key, value) { //Local DB in Map Set Function Implement
//         if (db.has(this.dbKey)) { //Existing
//             const createNewMap = new Map(Object.entries(db.get(this.dbKey)));
//             createNewMap.set(key, value);
//             db.delByPriority(this.dbKey, 1);
//             db.set(this.dbKey, Object.fromEntries(createNewMap));
//         } else { //Create New MAP
//             const createNewMap = new Map();
//             createNewMap.set(key, value);
//             db.set(this.dbKey, Object.fromEntries(createNewMap));
//         }
//     }

//     get(key) {
//         // console.log(db.has(this.dbKey))
//         if (db.has(this.dbKey)) { //Existing
//             const createNewMap = new Map(Object.entries(db.get(this.dbKey)));
//             // console.log(createNewMap.get(key))
//             return createNewMap.get(key);
//         } else {
//             return undefined;
//         }
//     }

//     getMap(key) {
//         if (db.has(this.dbKey)) { //Existing
//             const createNewMap = new Map(Object.entries(db.get(this.dbKey)));
//             return new Map(Object.entries(createNewMap.get(key)));
//         } else {
//             return new Map();
//         }
//     }

//     has(key) {
//         if (db.has(this.dbKey)) { //Existing
//             const createNewMap = new Map(Object.entries(db.get(this.dbKey)));
//             return createNewMap.has(key);
//         } else {
//             return false;
//         }
//     }

//     delete(key) {
//         if (db.has(this.dbKey)) { //Existing
//             const createNewMap = new Map(Object.entries(db.get(this.dbKey)));
//             if (createNewMap.has(key)) {
//                 createNewMap.delete(key)
//                 db.delByPriority(this.dbKey, 1);
//                 db.set(this.dbKey, Object.fromEntries(createNewMap));
//             }
//         }
//     }
// }

// module.exports = { MapToLocal }


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