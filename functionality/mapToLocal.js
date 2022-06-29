/* Require dependencies */
const db = require("croxydb");

class MapToLocal {
    constructor(dbKey) {
        this.dbKey = dbKey;
    }

    setMap(key, value) {
        if (db.has(this.dbKey)) { //Existing
            const createNewMap = new Map(Object.entries(db.get(this.dbKey)));
            createNewMap.set(key, Object.fromEntries(value));
            db.delByPriority(this.dbKey, 1);
            db.set(this.dbKey, Object.fromEntries(createNewMap));
        } else { //Create New MAP
            const createNewMap = new Map();
            createNewMap.set(key, Object.fromEntries(value));
            db.set(this.dbKey, Object.fromEntries(createNewMap));
        }
    }

    set(key, value) { //Local DB in Map Set Function Implement
        if (db.has(this.dbKey)) { //Existing
            const createNewMap = new Map(Object.entries(db.get(this.dbKey)));
            createNewMap.set(key, value);
            db.delByPriority(this.dbKey, 1);
            db.set(this.dbKey, Object.fromEntries(createNewMap));
        } else { //Create New MAP
            const createNewMap = new Map();
            createNewMap.set(key, value);
            db.set(this.dbKey, Object.fromEntries(createNewMap));
        }
    }

    get(key) {
        if (db.has(this.dbKey)) { //Existing
            const createNewMap = new Map(Object.entries(db.get(this.dbKey)));
            return createNewMap.get(key);
        } else {
            return undefined;
        }
    }

    getMap(key) {
        if (db.has(this.dbKey)) { //Existing
            const createNewMap = new Map(Object.entries(db.get(this.dbKey)));
            return new Map(Object.entries(createNewMap.get(key)));
        } else {
            return new Map();
        }
    }

    has(key) {
        if (db.has(this.dbKey)) { //Existing
            const createNewMap = new Map(Object.entries(db.get(this.dbKey)));
            return createNewMap.has(key);
        } else {
            return false;
        }
    }

    delete(key) {
        if (db.has(this.dbKey)) { //Existing
            const createNewMap = new Map(Object.entries(db.get(this.dbKey)));
            if (createNewMap.has(key)) {
                createNewMap.delete(key)
                db.delByPriority(this.dbKey, 1);
                db.set(this.dbKey, Object.fromEntries(createNewMap));
            }
        }
    }
}

module.exports = { MapToLocal }