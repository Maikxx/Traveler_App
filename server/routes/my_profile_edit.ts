import * as express from 'express'
import * as mongoose from 'mongoose'

import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

import handleHttpError from '../utils/handleError'

/*
Route for handling showing the users edit view of the users profile.

1. Check if the user has an active session and is actually valid.
2. Get the current users data and store it in a variable that will be rendered as default values in the inputs.
*/

function renderMyProfileEdit (req: express.Request & {session: SessionType}, res: express.Response) {
    const cusErr = {
        redirectTo: '/my_profile',
        scope: 'my_profile_edit',
        message: '',
        logOut: false,
    }

    if (req.session.error) {
        console.log(req.session.error)
    }

    if (req.session && req.session.userId) {
        Profile.findOne({ _id: req.session.userId })
            .then((myProfile: ProfileType) => {
                if (!myProfile.hasFinishedQuestionaire) {
                    cusErr.message = 'You have not yet filled in the questionaire!'

                    handleHttpError(req, res, 403, '/questionaire', cusErr.scope, cusErr.message, cusErr.logOut)
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
            })
            .catch((error: mongoose.Error) => {
                cusErr.message = 'Something went wrong in profile edit!'

                handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
            })
    } else {
        cusErr.message = 'You are not logged in!'

        handleHttpError(req, res, 403, '/', cusErr.scope, cusErr.message, true)
    }
}

export default renderMyProfileEdit
