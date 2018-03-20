import * as express from 'express'
import handleHttpError from '../utils/handleError'
import { sessionType } from '../types/sessionType'

function handleLogOut (req: express.Request & {session: sessionType}, res: express.Response) {
    req.session.destroy(error => {
        if (error) {
            console.error(error)
            handleHttpError(req, res, 500, 'Internal Server Error', '/')
        } else {
            res.redirect('/')
        }
    })
}

export default handleLogOut
