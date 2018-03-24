import * as express from 'express'
import Profile from '../models/profile'
import handleHttpError from '../utils/handleError'
import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

function renderMatchesOverview (req: express.Request & {session: SessionType}, res: express.Response) {
    if (req.session.error) {
        console.log(req.session.error)
    }

    if (req.session.userId) {
        Profile.find({ '_id': { $ne: req.session.userId } })
            .limit(10)
            .exec()
            .then((results: ProfileType[]) => {
                req.session.error = null

                const overviewData = results.map((result: any) => ({
                    _id: result._id,
                    firstName: result.firstName,
                    fullName: result.fullName,
                    profileImages: result.profileImages.map(profileImage => profileImage.replace('public', '')),
                    age: result.age,
                    ownGender: result.ownGender,
                    description: result.description,
                    favouriteHolidayDestination: result.favouriteHolidayDestination,
                    likesToHike: result.likesToHike,
                    favouriteOverallTravelTime: result.favouriteOverallTravelTime,
                }))

                res.render('matches_overview.ejs', { overviewData })
            })
            .catch(error => {
                handleHttpError(
                    req,
                    res,
                    500,
                    '/',
                    'matches_overview',
                    'Error finding a profile!',
                    error
                )
            })
    } else {
        handleHttpError(
            req,
            res,
            401,
            '/',
            'matches_overview',
            'You are not logged in!'
        )
    }
}

export default renderMatchesOverview
