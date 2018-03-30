const bcrypt = require('bcrypt')
const fs = require('fs')
const fileName = 'MOCK_DATA.json'
const filePath = `${__dirname}/${fileName}`

// Read the file.
fs.readFile(filePath, async (error, data) => {
    // Parse it to JSON.
    const parsedData = JSON.parse(data)

    // Wait for all promises to resolve, which corresponds to all the users being transformed (passwords are created and the data of the user is transformed).
    const profiles = await Promise.all(parsedData.map((profile, i) => {
        return bcrypt.hash(profile.rawPassword, 10)
            .then(hash => {
                if (profile.matchSettings.maxSearchAge < profile.matchSettings.minSearchAge) {
                    [profile.matchSettings.minSearchAge, profile.matchSettings.maxSearchAge] = [profile.matchSettings.maxSearchAge, profile.matchSettings.minSearchAge]
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

                profile.hasFinishedQuestionaire = true
                profile._id = i

                profile.password = hash

                console.log(profile)
                return profile
            })
            .catch(error => {
                throw new Error(error)
            })
    }))

    // Wait for the buffer to resolve, which gets passed a JSON.stringify method, where the items are indented by 4 spaces.
    const buffer = await Buffer.from(JSON.stringify(profiles, null, 4))

    // Write the file to the disk, with the transformed data.
    fs.writeFile(__dirname + '/' + fileName, buffer, (error) => {
        if (error) {
            throw new Error(error)
        }
    })
})