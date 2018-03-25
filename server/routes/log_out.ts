import * as express from 'express'
import handleHttpError from '../utils/handleError'
import { SessionType } from '../types/SessionType'

function handleLogOut (req: express.Request & {session: SessionType}, res: express.Response) {
    req.session.destroy(error => {
        if (error) {
            handleHttpError(
                req,
                res,
                500,
                '/',
                'log_out',
                'There was an error logging you out!',
                true,
                error
            )
        } else {
            res.redirect('/')
        }
    })
}

export default handleLogOut
