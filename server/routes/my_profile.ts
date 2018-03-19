import Profile from '../models/profile'
import handleHttpError from '../utils/handle_error'

function renderMyProfile (req: any, res: any) {
    Profile.find({ _id: '5aaec5cdd3eca06b4a427ce1' })
        .then((result: [ any ]) => {
            const profileData = {
                _id: null,
                firstName: null,
                fullName: null,
                ownGender: null,
                birthDate: null,
                age: null,
                profileImages: null,
                description: null,
                hasTraveledTo: null,
                favouriteHolidayDestination: null,
                favouriteHolidayTypes: null,
                plansHolidaysAhead: null,
                likesToHike: null,
                prefersInterContinental: null,
                wantsToVisitSoon: null,
                hasVisitedThisMuchDestinations: null,
                favouriteOverallTravelTime: null,
                wantsToTravelQuickly: null,
                mostImportantInRelationShip: null,
                wantsToMarry: null,
                foremostRelationshipMotivation: null,
                wantsToOrAlreadyHasChildren: null,
                drinksAlcohol: null,
                smokes: null,
                likesToBeInNature: null,
                favouriteMusicGenre: null,
                yearlyEarns: null,
                livesIn: null,
                jobTitle: null,
                lengthInCm: null,
            }

            const {
                _id,
                firstName,
                fullName,
                ownGender,
                birthDate,
                age,
                profileImages,
                description,
                hasTraveledTo,
                favouriteHolidayDestination,
                favouriteHolidayTypes,
                plansHolidaysAhead,
                likesToHike,
                prefersInterContinental,
                wantsToVisitSoon,
                hasVisitedThisMuchDestinations,
                favouriteOverallTravelTime,
                wantsToTravelQuickly,
                mostImportantInRelationShip,
                wantsToMarry,
                foremostRelationshipMotivation,
                wantsToOrAlreadyHasChildren,
                drinksAlcohol,
                smokes,
                likesToBeInNature,
                favouriteMusicGenre,
                yearlyEarns,
                livesIn,
                jobTitle,
                lengthInCm,
            } = result[0]

            profileData._id = _id
            profileData.firstName = firstName
            profileData.fullName = fullName
            profileData.ownGender = ownGender
            profileData.birthDate = birthDate
            profileData.age = age
            profileData.profileImages = profileImages.map(profileImage => profileImage.replace('public', ''))
            profileData.description = description
            profileData.hasTraveledTo = hasTraveledTo
            profileData.favouriteHolidayDestination = favouriteHolidayDestination
            profileData.favouriteHolidayTypes = favouriteHolidayTypes
            profileData.plansHolidaysAhead = plansHolidaysAhead
            profileData.likesToHike = likesToHike
            profileData.prefersInterContinental = prefersInterContinental
            profileData.wantsToVisitSoon = wantsToVisitSoon
            profileData.hasVisitedThisMuchDestinations = hasVisitedThisMuchDestinations
            profileData.favouriteOverallTravelTime = favouriteOverallTravelTime
            profileData.wantsToTravelQuickly = wantsToTravelQuickly
            profileData.mostImportantInRelationShip = mostImportantInRelationShip
            profileData.wantsToMarry = wantsToMarry
            profileData.foremostRelationshipMotivation = foremostRelationshipMotivation
            profileData.wantsToOrAlreadyHasChildren = wantsToOrAlreadyHasChildren
            profileData.drinksAlcohol = drinksAlcohol
            profileData.smokes = smokes
            profileData.likesToBeInNature = likesToBeInNature
            profileData.favouriteMusicGenre = favouriteMusicGenre
            profileData.yearlyEarns = yearlyEarns
            profileData.livesIn = livesIn
            profileData.jobTitle = jobTitle
            profileData.lengthInCm = lengthInCm

            res.render('my_profile.ejs', { profileData })
        })
        .catch(error => {
            console.error(error)
            handleHttpError(res, 500, 'Internal Server Error')
        })
}

export default renderMyProfile
