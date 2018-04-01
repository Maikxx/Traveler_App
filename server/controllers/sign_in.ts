import * as express from 'express'
import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

import validationRegex from '../utils/regex'
import handleHttpError from '../utils/handleError'
import errorMessages from '../utils/errorMessages'

/*
Controller for handling signing in of users.

1. The data gets tested, before it is stored in Mongo.
2. There are checks to see if a Profile already exists, if the data is valid and if the user filled in everything the right way.
3. If everything succeeds the user will be logged in,
there will be cookies set and the user will be redirected to the matches overview page.
*/

function handleSignIn (req: express.Request & {session: SessionType}, res: express.Response) {
    const cusErr = {
        redirectTo: '/',
        scope: 'log_in',
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
        Profile.findOne({ email: email.toLowerCase() })
            .then((user: ProfileType) => {
                if (!user) {
                    handleHttpError(req, res, 409, cusErr.redirectTo,
                        cusErr.scope, errorMessages.generalAuthenticationFailed, cusErr.logOut)
                }

                bcrypt.compare(password, user.password, (error: NodeJS.ErrnoException, response: any) => {
                    if (error) {
                        handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, errorMessages.serverError, cusErr.logOut, error)
                    }

                    if (response) {
                        req.session.userId = user._id
                        req.session.error = null

                        if (user.hasFinishedQuestionaire) {
                            res.redirect('/matches_overview')
                        } else {
                            res.redirect('/questionaire')
                        }
                    } else {
                        handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, errorMessages.serverError, cusErr.logOut)
                    }
                })
            })
            .catch((error: mongoose.Error) => {
                handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, errorMessages.serverError, cusErr.logOut, error)
            })
    } else {
        handleHttpError(req, res, 412, cusErr.redirectTo, cusErr.scope, errorMessages.requiredFieldMissingOrInvalid, cusErr.logOut)
    }
}

export default handleSignIn
