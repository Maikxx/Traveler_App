if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

const mongoose = require('mongoose')
const fs = require('fs')
const fileName = './MOCK_DATA_500.json'
const file = require(fileName)

mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`)

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
    // rawPassword: {
    //     type: String,
    // },
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
    },
    description: String,
    hasTraveledTo: {
        type: Array,
    },
    favouriteHolidayDestination: {
        type: String,
    },
    favouriteHolidayTypes: {
        type: [ String ],
        enum: [ 'Roundtrip', 'Family', 'Bike', 'Hike', 'Backpacking', 'Beach', 'Winter' ],
    },
    plansHolidaysAhead: {
        type: String,
        enum: [ 'Often', 'Sometimes', 'No' ],
    },
    likesToHike: {
        type: String,
        enum: [ 'Yes', 'Sometimes', 'No' ],
    },
    prefersInterContinental: {
        type: String,
        enum: [ 'Yes', 'Sometimes', 'No' ],
    },
    wantsToVisitSoon: {
        type: Array,
    },
    hasVisitedThisMuchDestinations: {
        type: Number,
        min: [ 0, 'You can not have less than 0 visited destinations!' ],
    },
    favouriteOverallTravelTime: {
        type: Number,
        min: [ 0, 'You can not have less than 0 weeks of favourite travel time!' ],
    },
    wantsToTravelQuickly: {
        type: String,
        enum: [ 'Yes', 'No' ],
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

            },
            maxMatchDistance: {
                type: Number,
                min: [ 0, 'You can not have a match that is less than 0km\'s away!' ],

            },
            minSearchAge: {
                type: Number,
                min: [ 0, 'You can not have a match that is less than 0!' ],

            },
            maxSearchAge: {
                type: Number,
                min: [ 0, 'You can not have a match that is less than 0!' ],

            },
            lookingForGender: {
                type: String,
                enum: [ 'Male', 'Female' ],
                required: true,
            },
        },
    },
    chats: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' } ],
})

const Profile = mongoose.model('Profile', profileSchema)

file.forEach((profile, i) => {
    const newUser = new Profile(
        {
            _id: new mongoose.Types.ObjectId(),
            fullName: profile.fullName,
            firstName: profile.fullName && profile.fullName.length && profile.fullName.substr(0, profile.fullName.indexOf(' ')),
            email: profile.email.toLowerCase(),
            password: profile.password,
            // rawPassword: profile.rawPassword,
            ownGender: profile.ownGender,
            profileImages: profile.profileImages,
            hasTraveledTo: profile.hasTraveledTo,
            favouriteHolidayDestination: profile.favouriteHolidayDestination,
            favouriteHolidayTypes: profile.favouriteHolidayTypes,
            plansHolidaysAhead: profile.plansHolidaysAhead,
            likesToHike: profile.likesToHike,
            prefersInterContinental: profile.prefersInterContinental,
            wantsToVisitSoon: profile.wantsToVisitSoon,
            hasVisitedThisMuchDestinations: profile.hasVisitedThisMuchDestinations,
            favouriteOverallTravelTime: profile.favouriteOverallTravelTime,
            wantsToMarry: profile.wantsToMarry,
            foremostRelationshipMotivation: profile.foremostRelationshipMotivation,
            wantsToOrAlreadyHasChildren: profile.wantsToOrAlreadyHasChildren,
            drinksAlcohol: profile.drinksAlcohol,
            smokes: profile.smokes,
            likesToBeInNature: profile.likesToBeInNature,
            favouriteMusicGenre: profile.favouriteMusicGenre,
            yearlyEarns: profile.yearlyEarns,
            birthdate: profile.birthdate,
            age: profile.age,
            livesIn: profile.livesIn,
            jobTitle: profile.jobTitle,
            lengthInCm: profile.lengthInCm,
            description: profile.description,
            mostImportantInRelationShip: profile.mostImportantInRelationShip,
            wantsToTravelQuickly: profile.wantsToTravelQuickly,
            matchSettings: {
                lookingForGender: profile.lookingForGender,
                matchHasToLikeToBeInNature: profile.matchSettings.matchHasToLikeToBeInNature,
                maxMatchDistance: profile.matchSettings.maxMatchDistance,
                minSearchAge: profile.matchSettings.minSearchAge,
                maxSearchAge: profile.matchSettings.maxSearchAge,
            },
        }
    )

    newUser.save()
        .then(result => {
            console.log(result)
        })
        .catch(error => {
            console.error(error)
        })
})