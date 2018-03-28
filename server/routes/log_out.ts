import * as express from 'express'

import { SessionType } from '../types/SessionType'

import handleHttpError from '../utils/handleError'

/*
Route for loggin users out.

1. Destroy a users session.
2. Redirect the user back to the homepage.
*/

function handleLogOut (req: express.Request & {session: SessionType}, res: express.Response) {
    const cusErr = {
        redirectTo: '/',
        scope: 'log_out',
        message: '',
        logOut: true,
    }

    if (req.session) {
        req.session.destroy((error: NodeJS.ErrnoException) => {
            if (error) {
                cusErr.message = 'There was an error logging you out!'

                handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
            } else {
                res.status(204).redirect('/')
            }
        })
    } else {
        res.status(409).redirect('/')
    }
}

export default handleLogOut
