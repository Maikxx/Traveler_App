import * as express from 'express'

import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

/*
Route for handling showing the users edit view of the users profile.

1. Check if the user has an active session and is actually valid.
2. Get the current users data and store it in a variable that will be rendered as default values in the inputs.
*/

async function renderMyProfileEdit (req: express.Request & {session: SessionType}, res: express.Response, next: express.NextFunction) {
    const cusErr = {
        req,
        res,
        code: 401,
        redirectTo: '/',
        scope: 'my_profile_edit',
        message: 'You need to be logged in to edit your profile!',
        logOut: true,
    }

    if (req.session.error) {
        console.log(req.session.error)
    }

    if (req.session && req.session.userId) {

        try {
            const myProfile = await Profile.findOne({ _id: req.session.userId }) as ProfileType

            if (!myProfile.hasFinishedQuestionaire) {
                res.status(409).redirect('/questionaire')
            } else {
                const profileData = {
                    _id: myProfile._id,
                    firstName: myProfile.firstName,
                    fullName: myProfile.fullName,
                    ownGender: myProfile.ownGender,
                    birthdate: myProfile.birthdate,
                    age: myProfile.age,
                    profileImages: myProfile.profileImages &&
                        myProfile.profileImages.length &&
                        myProfile.profileImages.map(profileImage => profileImage && profileImage.replace('public', '')),
                    description: myProfile.description,
                    hasTraveledTo: myProfile.hasTraveledTo && myProfile.hasTraveledTo.join(', '),
                    favouriteHolidayDestination: myProfile.favouriteHolidayDestination,
                    favouriteHolidayTypes: myProfile.favouriteHolidayTypes,
                    plansHolidaysAhead: myProfile.plansHolidaysAhead,
                    likesToHike: myProfile.likesToHike,
                    prefersInterContinental: myProfile.prefersInterContinental,
                    wantsToVisitSoon: myProfile.wantsToVisitSoon && myProfile.wantsToVisitSoon.join(', '),
                    hasVisitedThisMuchDestinations: myProfile.hasVisitedThisMuchDestinations,
                    favouriteOverallTravelTime: myProfile.favouriteOverallTravelTime,
                    wantsToTravelQuickly: myProfile.wantsToTravelQuickly,
                    mostImportantInRelationShip: myProfile.mostImportantInRelationShip,
                    wantsToMarry: myProfile.wantsToMarry,
                    foremostRelationshipMotivation: myProfile.foremostRelationshipMotivation,
                    wantsToOrAlreadyHasChildren: myProfile.wantsToOrAlreadyHasChildren,
                    drinksAlcohol: myProfile.drinksAlcohol,
                    smokes: myProfile.smokes,
                    likesToBeInNature: myProfile.likesToBeInNature,
                    favouriteMusicGenre: myProfile.favouriteMusicGenre,
                    yearlyEarns: myProfile.yearlyEarns,
                    livesIn: myProfile.livesIn,
                    jobTitle: myProfile.jobTitle,
                    lengthInCm: myProfile.lengthInCm,
                    matchSettings: {
                        matchHasToLikeToBeInNature: myProfile.matchSettings.matchHasToLikeToBeInNature,
                        maxMatchDistance: myProfile.matchSettings.maxMatchDistance,
                        minSearchAge: myProfile.matchSettings.minSearchAge,
                        maxSearchAge: myProfile.matchSettings.maxSearchAge,
                    },
                }

                res.render('my_profile_edit.ejs', { profileData })
            }
        } catch (error) {
            next(error)
        }
    } else {
        next(cusErr)
    }
}

export default renderMyProfileEdit
