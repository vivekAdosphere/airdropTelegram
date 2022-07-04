/* --> xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx <---
File Name : LocalData.js
File Description : Local Data Model for MongoDB
---> Required Dependencies <---
Installed Dependencies : 
1) mongoose ("mongoose")
User Defined Dependencies :
---> Function Definitions <---
--> xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx---xxx <--- */

const mongoose = require('mongoose');

const localData = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true,
    },
    states: {
        type: Map,
    }
});

module.exports = mongoose.model('LocalData', localData);