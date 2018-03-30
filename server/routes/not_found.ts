import * as express from 'express'

import { SessionType } from '../types/SessionType'

import handleHttpError from '../utils/handleError'

/*
Route for handling all the not founds.
*/

function renderNotFound (
        error: express.Errback,
        req: express.Request & {session: SessionType},
        res: express.Response,
        next: express.NextFunction
) {
    if (error) {
        return handleHttpError(req, res, 404, '/', 'not_found', 'This page could not be found!', true, error)
    }
}

export default renderNotFound
