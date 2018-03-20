import Profile from '../models/profile'
import handleHttpError from '../utils/handleError'

function renderMatchProfile (req: any, res: any) {
    if (req.session && req.session.userId) {
        const { _id } = req.params

        if (_id) {
            Profile.find({ _id })
                .then((result: [ any ]) => {
                    req.session.error = null

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

                    res.render('match_profile.ejs', { profileData })
                })
                .catch(error => {
                    console.error(error)
                    console.error('Invalid id passed in!')
                    handleHttpError(req, res, 400, 'Bad Request', '/matches_overview')
                })
        } else {
            console.error('No id passed in to the url!')
            handleHttpError(req, res, 400, 'Bad Request', '/matches_overview')
        }
    } else {
        console.error('You are not logged in!')
        handleHttpError(req, res, 401, 'Credentials Required', '/')
    }
}

export default renderMatchProfile
