const bcrypt = require('bcrypt')
const fs = require('fs')
const fileName = './MOCK_DATA_150.json'
const file = require(fileName)

file.forEach((profile, i) => {
    bcrypt.hash(profile.rawPassword, 10, (error, hash) => {
        if (error) {
            throw new Error(error)
        }

        if (profile.wantsToOrAlreadyHasChildren && profile.wantsToOrAlreadyHasChildren === 'Yes I have them') {
            profile.wantsToOrAlreadyHasChildren = 'Yes, I have them'
        } else if (profile.wantsToOrAlreadyHasChildren && profile.wantsToOrAlreadyHasChildren === 'Yes I want them') {
            profile.wantsToOrAlreadyHasChildren = 'Yes, I want them'
        }

        if (profile.drinksAlcohol && profile.drinksAlcohol === 'Yes often') {
            profile.drinksAlcohol = 'Yes, often'
        } else if (profile.drinksAlcohol && profile.drinksAlcohol === 'Yes sometimes') {
            profile.drinksAlcohol = 'Yes, sometimes'
        }

        if (profile.smokes && profile.smokes === 'Yes often') {
            profile.smokes = 'Yes, often'
        } else if (profile.smokes && profile.smokes === 'Yes sometimes') {
            profile.smokes = 'Yes, sometimes'
        }

        profile.password = hash
        fs.writeFile(__dirname + '/MOCK_DATA_150.json', JSON.stringify(file), (error) => {
            if (error) {
                throw new Error(error)
            }
        })
    })
})