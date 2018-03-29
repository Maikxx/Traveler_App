import * as express from 'express'
import * as mongoose from 'mongoose'

import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

import handleHttpError from '../utils/handleError'

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
        Profile.find({ _id: req.session.userId })
            .then((result: ProfileType[]) => {
                if (result && result.length) {
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
                        matchSettings: {
                            matchHasToLikeToBeInNature: currentResult.matchSettings.matchHasToLikeToBeInNature,
                            maxMatchDistance: currentResult.matchSettings.maxMatchDistance,
                            minSearchAge: currentResult.matchSettings.minSearchAge,
                            maxSearchAge: currentResult.matchSettings.maxSearchAge,
                        },
                    }

                    res.render('my_profile_edit.ejs', { profileData })
                } else {
                    cusErr.message = 'No result found!'

                    handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut)
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
