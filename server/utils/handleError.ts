import * as express from 'express'
import { SessionType } from '../types/SessionType'
import * as httpStatus from 'http-status'

function handleHttpError (
        req: express.Request & {session: SessionType},
        res: express.Response,
        code: number,
        redirectToHere: string,
        scope: string,
        message: string,
        logOut: boolean = true,
        error?: any
) {
    if (logOut) {
        if (req.session && req.session.userId) {
            req.session.userId = null
        }
    }

    if (req.session) {
        req.session.error = {
            code,
            title: message,
        }
    }

    console.error(error)
    console.log(`${message} in: ${scope}, with code: ${code} and title: ${httpStatus[code]}!`)

    res.status(code).redirect(redirectToHere)
}

export default handleHttpError
