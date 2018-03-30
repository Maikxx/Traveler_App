import * as express from 'express'
import * as mongoose from 'mongoose'

import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

import handleHttpError from '../utils/handleError'

/*
Route for showing the user the questionaire.

1. Check if the user is in the database and has a session.
2. If it is not render an error, else render the page.
*/

function renderQuestionaire (req: express.Request & {session: SessionType}, res: express.Response) {
    const cusErr = {
        redirectTo: '/',
        scope: 'questionaire',
        message: '',
        logOut: true,
    }

    if (req.session && req.session.userId) {
        const { userId } = req.session

        Profile.findOne({ _id: userId })
            .then((myProfile: ProfileType) => {
                if (myProfile) {
                    if (!myProfile.hasFinishedQuestionaire) {
                        res.render('questionaire.ejs', { _id: myProfile._id })
                    } else {
                        cusErr.message = 'You can only fill in the questionaire once!'

                        handleHttpError(req, res, 400, '/matches_overview',
                            cusErr.scope, cusErr.message, false)
                    }
                } else {
                    cusErr.message = 'Your profile is not found!'

                    handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut)
                }
            })
            .catch((error: mongoose.Error) => {
                cusErr.message = 'An error occured getting profiles!'

                handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
            })

    } else {
        cusErr.message = 'You are not logged in!'

        handleHttpError(req, res, 403, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut)
    }
}

export default renderQuestionaire
