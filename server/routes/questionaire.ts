import * as express from 'express'
import Profile from '../models/profile'
import handleHttpError from '../utils/handleError'
import { SessionType } from '../types/SessionType'

function renderQuestionaire (req: express.Request & {session: SessionType}, res: express.Response) {
    if (req.session && req.session.userId) {
        const _id = req.session.userId

        Profile.count({ _id })
            .then((count: number) => {
                if (count > 0) {
                    res.render('questionaire.ejs', { _id })
                } else {
                    handleHttpError(
                        req,
                        res,
                        500,
                        '/',
                        'questionaire',
                        'There are not more than 0 items found!'
                    )
                }
            })
            .catch(error => {
                handleHttpError(
                    req,
                    res,
                    500,
                    '/',
                    'questionaire',
                    'An error occured counting profiles!',
                    error
                )
            })

    } else {
        handleHttpError(
            req,
            res,
            401,
            '/',
            'questionaire',
            'You are not logged in!'
        )
    }
}

export default renderQuestionaire
