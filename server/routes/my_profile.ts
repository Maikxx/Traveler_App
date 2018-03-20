import * as express from 'express'
import Profile from '../models/profile'
import handleHttpError from '../utils/handleError'
import { sessionType } from '../types/sessionType'
import { profileType } from '../types/profileType'

function renderMyProfile (req: express.Request & {session: sessionType}, res: express.Response) {
    if (req.session && req.session.userId) {
        Profile.find({ _id: req.session.userId })
            .then((result: profileType[]) => {
                if (result && result.length) {
                    req.session.error = null

                    const currentResult = result[0]

                    const profileData = {
                        _id: currentResult._id,
                        firstName: currentResult.firstName,
                        fullName: currentResult.fullName,
                        ownGender: currentResult.ownGender,
                        birthdate: currentResult.birthdate,
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
                } else {
                    console.error('No result found!')
                    handleHttpError(req, res, 500, 'Internal Server Error', '/')
                }
            })
            .catch(error => {
                console.error(error)
                handleHttpError(req, res, 500, 'Internal Server Error', '/')
            })
    } else {
        console.error('You are not logged in!')
        handleHttpError(req, res, 401, 'Credentials Required', '/')
    }
}

export default renderMyProfile
