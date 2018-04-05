import * as express from 'express'

import { SessionType } from '../types/SessionType'

import handleHttpError from '../utils/handleError'

function handleErrors(error: any, req: express.Request & {session: SessionType}, res: express.Response, next: express.NextFunction) {
    if (error) {
        console.error(error.stack)
        handleHttpError(req, res, 404, '/', 'not_found', error.message
            ? error.message
            : 'Something went wrong inside of the server!', true, error)
    }
}

export default handleErrors
