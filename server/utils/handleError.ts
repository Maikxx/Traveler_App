import * as express from 'express'
import * as mongoose from 'mongoose'
import * as httpStatus from 'http-status'

import { SessionType } from '../types/SessionType'

/*
Function for catching all types of errors and sending an error back to the view, said to render.

The code is the HTTP status code.
Scope is where the error comes from (sometimes there is no error.stack, so I did this).
Message is what will be shown to the user.
LogOut is a decision wether or not the user needs to be logged out.
If there is an error, like from a promise, then log that.
*/

function handleHttpError (
        req: express.Request & {session: SessionType},
        res: express.Response,
        code: number,
        redirectToHere: string,
        scope: string,
        message: string,
        logOut: boolean = true,
        error?: mongoose.Error | NodeJS.ErrnoException | express.Errback
) {
    if (req.session) {
        req.session.error = {
            code,
            title: message,
        }
    }

    if (logOut) {
        if (req.session && req.session.userId) {
            req.session.userId = null
        }
    }

    if (error) {
        console.error(error)
    }

    console.log(`${message} in: ${scope}, with code: ${code} and title: ${httpStatus[code]}`)

    res.status(code).redirect(redirectToHere)
}

export default handleHttpError
