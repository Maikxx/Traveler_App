import * as express from 'express'

import { SessionType } from '../types/SessionType'

import handleHttpError from '../utils/handleError'

/*
Route for handling not founds.
*/

function renderNotFound (
        req: express.Request & {session: SessionType},
        res: express.Response,
        next: express.NextFunction
) {
    return handleHttpError(req, res, 404, '/', 'not_found', 'The page requested could not be found, you have been redirected!', true)
}

export default renderNotFound
