import * as express from 'express'
import { sessionType } from '../types/sessionType'

function handleHttpError (
        req: express.Request & {session: sessionType},
        res: express.Response,
        code: number,
        title: string,
        redirectToHere: string
) {
    req.session.error = { code, title }
    res.status(code).redirect(redirectToHere)
}

export default handleHttpError
