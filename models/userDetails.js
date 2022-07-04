const mongoose = require("mongoose");
const moment = require("moment");

const getCurrentTime = () => {
    let dateAndTime = moment().utcOffset(330)
    return dateAndTime.format()

}

const userDetail = new mongoose.Schema({
    chat_id: {
        type: Number,
        required: true,
        default: null
    },
    UserInfo: {

        name: {
            type: String,
            trim: true,
            default: null
        },
        email: {
            type: String,
            required: false,
            default: null
        },
        twitter_profile_link: {
            type: String,
            default: null,
            required: false
        },
        reddit_username: {
            type: String,
            required: false,
            default: null
        },
        discord_username: {
            type: String,
            required: false,
            default: null
        },
        fb_profile_link: {
            type: String,
            required: false,
            default: null
        },
        insta_profile_link: {
            type: String,
            required: false,
            default: null
        },
        discord_invitation_link: {
            type: String,
            required: false,
            default: null
        },
        wallet_address: {
            type: String,
            required: false,
            default: null
        }
    },
    InvitedTelegramUsers: {
        firstUser: {
            type: String,
            required: false,
            default: null
        },
        secondUser: {
            type: String,
            required: false,
            default: null
        },
        thirdUser: {
            type: String,
            required: false,
            default: null
        },
        forthUser: {
            type: String,
            required: false,
            default: null
        },
        fifthUser: {
            type: String,
            required: false,
            default: null
        }
    },
    InvitedTwitterUsers: {
        firstTwitterUser: {
            type: String,
            required: false,
            default: null
        },
        secondTwitterUser: {
            type: String,
            required: false,
            default: null
        },
        thirdTwitterUser: {
            type: String,
            required: false,
            default: null
        },
        forthTwitterUser: {
            type: String,
            required: false,
            default: null
        },
        fifthTwitterUser: {
            type: String,
            required: false,
            default: null
        },

    },
    is_participated: {
        type: Boolean,
        required: false,
        default: false
    },
    completed_level_of_tasks: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3],
        default: 0
    },
    is_joined_telegram_group: {
        type: Boolean,
        required: false,
        default: false
    },
    is_joined_telegram_channel: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("User", userDetail);