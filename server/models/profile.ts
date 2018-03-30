import * as mongoose from 'mongoose'

// Create a Mongoose Schema for a profile type. A Schema is a blueprint, of which real entries in the DB are created.

const profileSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        unique: true,
        match: /^\w+@\w+\..{2,3}(.{2,3})?$/,
        required: true,
    },
    password: {
        type: String,
        match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$/,
        required: true,
    },
    // Development only
    rawPassword: {
        type: String,
    },
    fullName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
    },
    ownGender: {
        type: String,
        enum: [ 'Male', 'Female' ],
        required: true,
    },
    birthdate: {
        type: Date,
        // required: true,
    },
    age: {
        type: Number,
        default: () => {
            if (this.birthdate && this.birthdate.length) {
                const today = new Date()
                const birthDate = new Date(this.birthdate)
                let age = today.getFullYear() - birthDate.getFullYear()
                const m = today.getMonth() - birthDate.getMonth()

                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--
                }

                return age
            }
        },
    },
    profileImages: {
        type: Array,
        // required: true,
    },
    description: String,
    hasTraveledTo: {
        type: Array,
        // required: true,
    },
    favouriteHolidayDestination: {
        type: String,
        // required: true,
    },
    favouriteHolidayTypes: {
        type: [ String ],
        enum: [ 'Roundtrip', 'Family', 'Bike', 'Hike', 'Backpacking', 'Beach', 'Winter' ],
        // required: true,
    },
    plansHolidaysAhead: {
        type: String,
        enum: [ 'Often', 'Sometimes', 'No' ],
        // required: true,
    },
    likesToHike: {
        type: String,
        enum: [ 'Yes', 'Sometimes', 'No' ],
        // required: true,
    },
    prefersInterContinental: {
        type: String,
        enum: [ 'Yes', 'Sometimes', 'No' ],
        // required: true,
    },
    wantsToVisitSoon: {
        type: Array,
        // required: true,
    },
    hasVisitedThisMuchDestinations: {
        type: Number,
        min: [ 0, 'You can not have less than 0 visited destinations!' ],
        // required: true,
    },
    favouriteOverallTravelTime: {
        type: Number,
        min: [ 0, 'You can not have less than 0 weeks of favourite travel time!' ],
        // required: true,
    },
    wantsToTravelQuickly: {
        type: String,
        enum: [ 'Yes', 'No' ],
        // required: true,
    },
    wantsToMarry: {
        type: String,
        enum: [ 'Yes', 'Maybe', 'No' ],
    },
    foremostRelationshipMotivation: String,
    wantsToOrAlreadyHasChildren: {
        type: String,
        enum: [ 'Yes, I have them', 'Yes, I want them', 'Maybe', 'No' ],
    },
    drinksAlcohol: {
        type: String,
        enum: [ 'Yes, often', 'Yes, sometimes', 'No' ],
    },
    smokes: {
        type: String,
        enum: [ 'Yes, often', 'Yes, sometimes', 'No' ],
    },
    likesToBeInNature: {
        type: String,
        enum: [ 'Yes', 'No' ],
        // required: true,
    },
    mostImportantInRelationShip: String,
    favouriteMusicGenre: String,
    yearlyEarns: {
        type: String,
        enum: [ 'Less than 25K', '25K-50K', 'More than 50K' ],
    },
    livesIn: String,
    jobTitle: String,
    lengthInCm: {
        type: Number,
        min: [ 0, 'You can not be smaller than 0cm!' ],
    },
    matchSettings: {
        type: {
            matchHasToLikeToBeInNature: {
                type: String,
                enum: [ 'Yes', 'No' ],
                // required: true,
            },
            maxMatchDistance: {
                type: Number,
                min: [ 0, 'You can not have a match that is less than 0km\'s away!' ],
                // required: true,
            },
            minSearchAge: {
                type: Number,
                min: [ 0, 'You can not have a match that is less than 0!' ],
                // required: true,
            },
            maxSearchAge: {
                type: Number,
                min: [ 0, 'You can not have a match that is less than 0!' ],
                // required: true,
            },
            lookingForGender: {
                type: String,
                enum: [ 'Male', 'Female' ],
                required: true,
            },
        },
    },
    chats: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' } ],
    hasFinishedQuestionaire: {
        type: Boolean,
        required: true,
    },
})

export default mongoose.model('Profile', profileSchema)
