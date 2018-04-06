import * as express from 'express'

import { SessionType } from '../types/SessionType'

/*
Route for loggin users out.

1. Destroy a users session.
2. Redirect the user back to the homepage.
*/

function handleLogOut (req: express.Request & {session: SessionType}, res: express.Response, next: express.NextFunction) {
    const cusErr = {
        req,
        res,
        code: 401,
        redirectTo: '/',
        scope: 'log_out',
        message: 'You need to be logged in to log out!',
        logOut: true,
    }

    if (req.session) {
        req.session.destroy((error: NodeJS.ErrnoException) => {
            if (error) {
                next(cusErr)
            } else {
                res.status(204).redirect(cusErr.redirectTo)
            }
        })
    } else {
        res.status(409).redirect(cusErr.redirectTo)
    }
}

export default handleLogOut
