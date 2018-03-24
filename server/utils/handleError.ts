import * as express from 'express'
import { SessionType } from '../types/SessionType'

function handleHttpError (
        req: express.Request & {session: SessionType},
        res: express.Response,
        code: number,
        title: string,
        redirectToHere: string
) {
    req.session.error = { code, title }
    res.status(code).redirect(redirectToHere)
}

export default handleHttpError
