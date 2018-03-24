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
        error?: any
) {
    req.session.error = {
        code,
        title: httpStatus[code],
    }
    console.error(error)
    console.log(`${message} in: ${scope}`)
    res.status(code).redirect(redirectToHere)
}

export default handleHttpError
