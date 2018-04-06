import * as express from 'express'

import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

/*
Route for showing the user the questionaire.

1. Check if the user is in the database and has a session.
2. If it is not render an error, else render the page.
*/

async function renderQuestionaire (req: express.Request & {session: SessionType}, res: express.Response, next: express.NextFunction) {
    const cusErr = {
        req,
        res,
        code: 401,
        redirectTo: '/',
        scope: 'questionaire',
        message: 'You need to be logged in fill in your questionaire!',
        logOut: true,
    }

    if (req.session && req.session.userId) {
        const { userId } = req.session

        try {
            const myProfile = await Profile.findOne({ _id: userId }) as ProfileType

            if (!myProfile.hasFinishedQuestionaire) {
                res.render('questionaire.ejs', { _id: myProfile._id })
            } else {
                res.status(200).redirect('/matches_overview')
            }
        } catch (error) {
            console.error(error)
            next(error)
        }
    } else {
        next(cusErr)
    }
}

export default renderQuestionaire
