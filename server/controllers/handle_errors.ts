import * as express from 'express'

import { SessionType } from '../types/SessionType'

import handleHttpError from '../utils/handleError'

function handleErrors(error: any, req: express.Request & {session: SessionType}, res: express.Response, next: express.NextFunction) {
    if (error) {
        handleHttpError(
            req,
            res,
            error.code
                ? error.code
                : 500,
            '/',
            error.scope
                ? error.scope
                : error.stack
                    ? error.stack
                    : 'No scope or stack received!',
            error.message
                ? error.message
                : 'Something went wrong inside of the server, please try again!',
            error.logOut
                ? error.logOut
                : true,
            error)
    } else {
        next()
    }
}

export default handleErrors
