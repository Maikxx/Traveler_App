import Profile from '../models/profile'
import handleHttpError from '../utils/handle_error'

function renderMyProfile (req: any, res: any) {
    Profile.find({ _id: '5aaec5cdd3eca06b4a427ce1' })
        .then((result: [ any ]) => {
            const profileData = {
                _id: result[0]._id,
                firstName: result[0].firstName,
                fullName: result[0].fullName,
                ownGender: result[0].ownGender,
                birthDate: result[0].birthDate,
                age: result[0].age,
                profileImages: result[0].profileImages.map(profileImage => result[0]. profileImage.replace('public', '')),
                description: result[0].description,
                hasTraveledTo: result[0].hasTraveledTo,
                favouriteHolidayDestination: result[0].favouriteHolidayDestination,
                favouriteHolidayTypes: result[0].favouriteHolidayTypes,
                plansHolidaysAhead: result[0].plansHolidaysAhead,
                likesToHike: result[0].likesToHike,
                prefersInterContinental: result[0].prefersInterContinental,
                wantsToVisitSoon: result[0].wantsToVisitSoon,
                hasVisitedThisMuchDestinations: result[0].hasVisitedThisMuchDestinations,
                favouriteOverallTravelTime: result[0].favouriteOverallTravelTime,
                wantsToTravelQuickly: result[0].wantsToTravelQuickly,
                mostImportantInRelationShip: result[0].mostImportantInRelationShip,
                wantsToMarry: result[0].wantsToMarry,
                foremostRelationshipMotivation: result[0].foremostRelationshipMotivation,
                wantsToOrAlreadyHasChildren: result[0].wantsToOrAlreadyHasChildren,
                drinksAlcohol: result[0].drinksAlcohol,
                smokes: result[0].smokes,
                likesToBeInNature: result[0].likesToBeInNature,
                favouriteMusicGenre: result[0].favouriteMusicGenre,
                yearlyEarns: result[0].yearlyEarns,
                livesIn: result[0].livesIn,
                jobTitle: result[0].jobTitle,
                lengthInCm: result[0].lengthInCm,
            }

            res.render('my_profile.ejs', { profileData })
        })
        .catch(error => {
            console.error(error)
            handleHttpError(req, res, 500, 'Internal Server Error', '/matches_overview')
        })
}

export default renderMyProfile
