import * as express from 'express'
import Profile from '../models/profile'
import handleHttpError from '../utils/handleError'
import { sessionType } from '../types/sessionType'

function handleDeleteAccount (req: express.Request & {session: sessionType}, res: express.Response) {
    if (req.session && req.session.userId) {
        Profile.find({ _id: req.session.userId })
            .remove(result => res.status(200).redirect('/'))
            .catch(error => {
                console.error(error)
                console.error('No such user exists!')
                handleHttpError(req, res, 401, 'Authentication Failed', '/')
            })
    } else {
        console.error('You are not logged in!')
        handleHttpError(req, res, 401, 'Creditentials Required', '/')
    }
}

export default handleDeleteAccount
