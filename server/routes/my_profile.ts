import * as express from 'express'
import * as mongoose from 'mongoose'

import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

import handleHttpError from '../utils/handleError'

/*
Route for showing the user their profile page.

1. Check if the user has a valid session and exists in the database.
2. Get their profile data.
3. Render it to the page.
*/

function renderMyProfile (req: express.Request & {session: SessionType}, res: express.Response) {
    const cusErr = {
        redirectTo: '/',
        scope: 'my_profile',
        message: '',
        logOut: true,
    }

    if (req.session && req.session.userId) {
        Profile.findOne({ _id: req.session.userId })
            .then((myProfile: ProfileType) => {
                req.session.error = null

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
                    hasTraveledTo: myProfile.hasTraveledTo,
                    favouriteHolidayDestination: myProfile.favouriteHolidayDestination,
                    favouriteHolidayTypes: myProfile.favouriteHolidayTypes,
                    plansHolidaysAhead: myProfile.plansHolidaysAhead,
                    likesToHike: myProfile.likesToHike,
                    prefersInterContinental: myProfile.prefersInterContinental,
                    wantsToVisitSoon: myProfile.wantsToVisitSoon,
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
                }

                res.render('my_profile.ejs', { profileData })
            })
            .catch((error: mongoose.Error) => {
                cusErr.message = 'Error while finding your profile!'

                handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
            })
    } else {
        cusErr.message = 'You are not logged in!'

        handleHttpError(req, res, 403, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut)
    }
}

export default renderMyProfile
