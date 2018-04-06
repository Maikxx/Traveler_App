import * as express from 'express'

import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

/*
Route for showing the user his or her matches, based on the data they filled in.

1. Check if the user and session exists.
2. Get profiles from the database, where:
    - Their _id is not equal to the users own.
    - Their gender is what the user is looking for.
    - Their age falls between the requirements that the user set.
    - That person is also looking for your gender.
    - That person also looking for someone that is at least your age.
    - **More would eventually ofcourse be added, except if I do so, there are no matches at this point in time.
    since I only have 1700 users in the database currently!**
3. Map over the found profiles and return the data of that specific person to an array overviewData.
4. Render that data to the page for the user.
*/

async function renderMatchesOverview (req: express.Request & {session: SessionType}, res: express.Response, next: express.NextFunction) {
    const cusErr = {
        req,
        res,
        code: 401,
        redirectTo: '/',
        scope: 'matches_overview',
        message: 'You need to be logged in to view your matches!',
        logOut: true,
    }

    if (req.session && req.session.userId) {
        try {
            const myProfile = await Profile.findOne({ _id: req.session.userId }) as ProfileType

            if (!myProfile.hasFinishedQuestionaire) {
                res.status(409).redirect('/questionaire')
            } else {
                const matchedProfiles = await Profile.find({ _id: { $ne: myProfile._id } })
                    .where('ownGender', myProfile.matchSettings.lookingForGender)
                    .where('age').gte(myProfile.matchSettings.minSearchAge).lte(myProfile.matchSettings.maxSearchAge)
                    .where('matchSettings.lookingForGender', myProfile.ownGender)
                    .where('matchSettings.minSearchAge').gte(myProfile.age)
                    // .where('matchSettings.maxSearchAge').lte(myProfile.age)
                    .limit(10) as ProfileType[]

                req.session.error = null

                const overviewData = matchedProfiles.map((matchedProfile: ProfileType) => ({
                    _id: matchedProfile._id,
                    firstName: matchedProfile.firstName,
                    fullName: matchedProfile.fullName,
                    profileImages: matchedProfile.profileImages &&
                        matchedProfile.profileImages.length &&
                        matchedProfile.profileImages.map(profileImage => profileImage.replace('public', '')),
                    age: matchedProfile.age,
                    ownGender: matchedProfile.ownGender,
                    description: matchedProfile.description,
                    favouriteHolidayDestination: matchedProfile.favouriteHolidayDestination,
                    likesToHike: matchedProfile.likesToHike,
                    favouriteOverallTravelTime: matchedProfile.favouriteOverallTravelTime,
                }))

                res.render('matches_overview.ejs', { overviewData })
            }
        } catch (error) {
            next(error)
        }
    } else {
        next(cusErr)
    }
}

export default renderMatchesOverview
