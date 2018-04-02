import * as express from 'express'

import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

/*
Route for showing the user their profile page.

1. Check if the user has a valid session and exists in the database.
2. Get their profile data.
3. Render it to the page.
*/

async function renderMyProfile (req: express.Request & {session: SessionType}, res: express.Response, next: express.NextFunction) {
    const cusErr = {
        req,
        res,
        code: 401,
        redirectTo: '/',
        scope: 'my_profile',
        message: 'You need to be logged in to view your profile!',
        logOut: true,
    }

    if (req.session && req.session.userId) {
        try {
            const myProfile = await Profile.findOne({ _id: req.session.userId }) as ProfileType

            if (!myProfile.hasFinishedQuestionaire) {
                throw new Error('You have not yet filled in the questionaire!')
            } else {
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
            }
        } catch (error) {
            next(error)
        }
    } else {
        next(cusErr)
    }
}

export default renderMyProfile
