import * as express from 'express'
import Profile from '../models/profile'
import handleHttpError from '../utils/handleError'
import { SessionType } from '../types/SessionType'

function renderQuestionaire (req: express.Request & {session: SessionType}, res: express.Response) {
    if (req.session.userId) {
        const _id = req.session.userId

        Profile.count({ _id }, (error: any, count: number) => {
            if (error) {
                console.error(error)
                handleHttpError(req, res, 500, 'Internal Server Error', '/')
            } else {
                if (count > 0) {
                    res.render('questionaire.ejs', { _id })
                } else {
                    console.error(error)
                    handleHttpError(req, res, 500, 'Internal Server Error', '/')
                }
            }
        })
    } else {
        console.error('You are not logged in!')
        handleHttpError(req, res, 401, 'Creditentials Required', '/')
    }
}

export default renderQuestionaire
