import * as express from 'express'
import handleHttpError from '../utils/handleError'
import { sessionType } from '../types/sessionType'

function renderNotFound (
        error: express.Errback,
        req: express.Request & {session: sessionType},
        res: express.Response,
        next: express.NextFunction
) {
    if (error) {
        handleHttpError(req, res, 404, 'Not Found', '/')
    }
}

export default renderNotFound
