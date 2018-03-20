import Profile from '../models/profile'
import handleHttpError from '../utils/handle_error'

function renderMyProfile (req: any, res: any) {
    Profile.find({ _id: '5aaec5cdd3eca06b4a427ce1' })
        .then((result: [ any ]) => {
            const currentResult = result[0]

            const profileData = {
                _id: currentResult._id,
                firstName: currentResult.firstName,
                fullName: currentResult.fullName,
                ownGender: currentResult.ownGender,
                birthDate: currentResult.birthDate,
                age: currentResult.age,
                profileImages: currentResult.profileImages &&
                    currentResult.profileImages.map(profileImage => profileImage && profileImage.replace('public', '')),
                description: currentResult.description,
                hasTraveledTo: currentResult.hasTraveledTo,
                favouriteHolidayDestination: currentResult.favouriteHolidayDestination,
                favouriteHolidayTypes: currentResult.favouriteHolidayTypes,
                plansHolidaysAhead: currentResult.plansHolidaysAhead,
                likesToHike: currentResult.likesToHike,
                prefersInterContinental: currentResult.prefersInterContinental,
                wantsToVisitSoon: currentResult.wantsToVisitSoon,
                hasVisitedThisMuchDestinations: currentResult.hasVisitedThisMuchDestinations,
                favouriteOverallTravelTime: currentResult.favouriteOverallTravelTime,
                wantsToTravelQuickly: currentResult.wantsToTravelQuickly,
                mostImportantInRelationShip: currentResult.mostImportantInRelationShip,
                wantsToMarry: currentResult.wantsToMarry,
                foremostRelationshipMotivation: currentResult.foremostRelationshipMotivation,
                wantsToOrAlreadyHasChildren: currentResult.wantsToOrAlreadyHasChildren,
                drinksAlcohol: currentResult.drinksAlcohol,
                smokes: currentResult.smokes,
                likesToBeInNature: currentResult.likesToBeInNature,
                favouriteMusicGenre: currentResult.favouriteMusicGenre,
                yearlyEarns: currentResult.yearlyEarns,
                livesIn: currentResult.livesIn,
                jobTitle: currentResult.jobTitle,
                lengthInCm: currentResult.lengthInCm,
            }

            res.render('my_profile.ejs', { profileData })
        })
        .catch(error => {
            console.error(error)
            handleHttpError(req, res, 500, 'Internal Server Error', '/matches_overview')
        })
}

export default renderMyProfile
