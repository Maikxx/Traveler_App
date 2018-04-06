import * as express from 'express'

import Profile from '../models/profile'
import Chat from '../models/chat'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'
import { ChatType } from '../types/chatType'

/*
Route for showing the user the matches full profile.

1. Check if the user is logged in and has a valid userId.
2. Get the profile data of the user passed in via the params in the url.
3. Find the correct id to pass to the data, for the button to render the correct chat, when clicked on.
4. Render the data to the page.
*/

async function renderMatchProfile (req: express.Request & {session: SessionType}, res: express.Response, next: express.NextFunction) {
    const cusErr = {
        req,
        res,
        code: 401,
        redirectTo: '/',
        scope: 'match_profile',
        message: 'You need to be logged in to view a matches profile!',
        logOut: true,
    }

    if (req.session && req.session.userId) {
        const { userId } = req.session

        try {
            const myProfile = await Profile.findOne({ _id: userId }) as ProfileType

            if (!myProfile.hasFinishedQuestionaire) {
                res.status(409).redirect('/questionaire')
            } else {
                const { _id: matchId } = req.params

                if (matchId && matchId.length) {
                    const matchProfile = await Profile.findOne({ _id: matchId }) as ProfileType

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

                    const chatResult = await Chat.findOne({ chatParticipants: { $all: [ userId, matchProfile._id ] } }) as ChatType

                    if (chatResult) {
                        profileData.chatId = chatResult._id
                    } else {
                        req.session.lastMatchId = profileData._id
                    }

                    res.render('match_profile.ejs', { profileData })
                }
            }
        } catch (error) {
            next(error)
        }
    } else {
        next(cusErr)
    }
}

export default renderMatchProfile
