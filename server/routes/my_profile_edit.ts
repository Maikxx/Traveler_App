import Profile from '../models/profile'
import handleHttpError from '../utils/handleError'

function renderMyProfileEdit (req: any, res: any) {
    if (req.session.error) {
        console.log(res.session.error)
    }

    if (req.session && req.session.userId) {
        Profile.find({ _id: req.session.userId })
            .then((result: [ any ]) => {
                if (result && result.length) {
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
                        matchSettings: {
                            matchHasToLikeToBeInNature: currentResult.matchSettings.matchHasToLikeToBeInNature,
                            maxMatchDistance: currentResult.matchSettings.maxMatchDistance,
                            minSearchAge: currentResult.matchSettings.minSearchAge,
                            maxSearchAge: currentResult.matchSettings.maxSearchAge,
                        },
                    }

                    res.render('my_profile_edit.ejs', { profileData })
                } else {
                    console.error('No result found!')
                    handleHttpError(req, res, 500, 'Internal Server Error', '/')
                }
            })
            .catch(error => {
                console.error('Something went wrong in profile edit')
                console.error(error)
                handleHttpError(req, res, 500, 'Internal Server Error', '/')
            })
    } else {
        console.error('You are not logged in!')
        handleHttpError(req, res, 401, 'Credentials Required', '/')
    }
}

export default renderMyProfileEdit
