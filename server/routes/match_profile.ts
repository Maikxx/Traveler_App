import * as express from 'express'
import * as mongoose from 'mongoose'

import Profile from '../models/profile'
import Chat from '../models/chat'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'
import { ChatType } from '../types/chatType'

import handleHttpError from '../utils/handleError'

/*
Route for showing the user the matches full profile.

1. Check if the user is logged in and has a valid userId.
2. Get the profile data of the user passed in via the params in the url.
3. Find the correct id to pass to the data, for the button to render the correct chat, when clicked on.
4. Render the data to the page.
*/

function renderMatchProfile (req: express.Request & {session: SessionType}, res: express.Response) {
    const cusErr = {
        redirectTo: '/matches_overview',
        scope: 'match_profile',
        message: '',
        logOut: false,
    }

    if (req.session && req.session.userId) {
        const { userId } = req.session

        Profile.findOne({ _id: userId })
            .then((myProfile: ProfileType) => {
                const { _id } = req.params

                if (_id && _id.length) {
                    Profile.findOne({ _id })
                        .then((matchProfile: ProfileType) => {
                            const profileData = {
                                _id: matchProfile._id,
                                firstName: matchProfile.firstName,
                                fullName: matchProfile.fullName,
                                ownGender: matchProfile.ownGender,
                                birthdate: matchProfile.birthdate,
                                age: matchProfile.age,
                                profileImages: matchProfile.profileImages &&
                                    matchProfile.profileImages.map(profileImage => profileImage && profileImage.replace('public', '')),
                                description: matchProfile.description,
                                hasTraveledTo: matchProfile.hasTraveledTo,
                                favouriteHolidayDestination: matchProfile.favouriteHolidayDestination,
                                favouriteHolidayTypes: matchProfile.favouriteHolidayTypes,
                                plansHolidaysAhead: matchProfile.plansHolidaysAhead,
                                likesToHike: matchProfile.likesToHike,
                                prefersInterContinental: matchProfile.prefersInterContinental,
                                wantsToVisitSoon: matchProfile.wantsToVisitSoon,
                                hasVisitedThisMuchDestinations: matchProfile.hasVisitedThisMuchDestinations,
                                favouriteOverallTravelTime: matchProfile.favouriteOverallTravelTime,
                                wantsToTravelQuickly: matchProfile.wantsToTravelQuickly,
                                mostImportantInRelationShip: matchProfile.mostImportantInRelationShip,
                                wantsToMarry: matchProfile.wantsToMarry,
                                foremostRelationshipMotivation: matchProfile.foremostRelationshipMotivation,
                                wantsToOrAlreadyHasChildren: matchProfile.wantsToOrAlreadyHasChildren,
                                drinksAlcohol: matchProfile.drinksAlcohol,
                                smokes: matchProfile.smokes,
                                likesToBeInNature: matchProfile.likesToBeInNature,
                                favouriteMusicGenre: matchProfile.favouriteMusicGenre,
                                yearlyEarns: matchProfile.yearlyEarns,
                                livesIn: matchProfile.livesIn,
                                jobTitle: matchProfile.jobTitle,
                                lengthInCm: matchProfile.lengthInCm,
                                chatId: null,
                            }

                            Chat.findOne({ chatParticipants: { $all: [ userId, matchProfile._id ] } })
                                .then((chatResult: ChatType) => {
                                    if (chatResult) {
                                        profileData.chatId = chatResult._id
                                    } else {
                                        req.session.lastMatchId = profileData._id
                                    }

                                    console.log(profileData.chatId)
                                    console.log(req.session.lastMatchId)

                                    res.render('match_profile.ejs', { profileData })
                                })
                                .catch((error: mongoose.Error) => {
                                    cusErr.message = 'Internal Server Error!'

                                    handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
                                })
                        })
                        .catch((error: mongoose.Error) => {
                            cusErr.message = 'Invalid id passed in!'

                            handleHttpError(req, res, 400, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
                        })
                } else {
                    cusErr.message = 'No id passed in to the url!'

                    handleHttpError(req, res, 400, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut)
                }
            })
            .catch((error: mongoose.Error) => {
                cusErr.message = 'We can not find a match with your profile id!'

                handleHttpError(req, res, 409, cusErr.redirectTo, cusErr.scope, cusErr.message, true, error)
            })
    } else {
        cusErr.message = 'You are not logged in!'

        handleHttpError(req, res, 401, cusErr.redirectTo, cusErr.scope, cusErr.message, true)
    }
}

export default renderMatchProfile
