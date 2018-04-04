import * as express from 'express'
import * as bcrypt from 'bcrypt'

import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

import validationRegex from '../utils/regex'
import errorMessages from '../utils/errorMessages'

/*
Controller for handling signing in of users.

1. The data gets tested, before it is stored in Mongo.
2. There are checks to see if a Profile already exists, if the data is valid and if the user filled in everything the right way.
3. If everything succeeds the user will be logged in,
there will be cookies set and the user will be redirected to the matches overview page.
*/

async function handleSignIn (req: express.Request & {session: SessionType}, res: express.Response, next: express.NextFunction) {
    const cusErr = {
        req,
        res,
        code: 412,
        redirectTo: '/',
        scope: 'sign_in',
        message: errorMessages.requiredFieldMissingOrInvalid,
        logOut: false,
    }

    const {
        email,
        password,
    } = req.body

    if (
        (email && email.length && validationRegex.email.test(email)) &&
        (password && password.length && validationRegex.password.test(password))
    ) {
        try {
            const user = await Profile.findOne({ email: email.toLowerCase() }) as ProfileType

            if (!user) {
                throw new Error(errorMessages.generalAuthenticationFailed)
            } else {
                bcrypt.compare(password, user.password, (error: NodeJS.ErrnoException, response: string) => {
                    if (error) {
                        throw new Error(errorMessages.serverError)
                    }

                    if (response && response.length) {
                        req.session.userId = user._id
                        req.session.error = null

                        if (user.hasFinishedQuestionaire) {
                            res.redirect('/matches_overview')
                        } else {
                            res.redirect('/questionaire')
                        }
                    } else {
                        throw new Error(errorMessages.serverError)
                    }
                })
            }
        } catch (error) {
            next(error)
        }
    } else {
        next(cusErr)
    }
}

export default handleSignIn
