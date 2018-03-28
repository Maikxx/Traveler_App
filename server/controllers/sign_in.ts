import * as express from 'express'
import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

import validationRegex from '../utils/regex'
import handleHttpError from '../utils/handleError'

/*
Controller for handling signing in of users.

The data gets tested, before it is stored in Mongo.
There are checks to see if a Profile already exists, if the data is valid and if the user filled in everything the right way.
If everything succeeds the user will be logged in, there will be cookies set and the user will be redirected to the matches overview page.
*/

function handleSignIn (req: express.Request & {session: SessionType}, res: express.Response) {
    if (req.body) {
        const cusErr = {
            redirectTo: '/',
            scope: 'log_in',
            message: 'Authentication Failed!',
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
            Profile.find({ email })
                .exec()
                .then((user: ProfileType[]) => {
                    if (!user || !user.length) {
                        handleHttpError(req, res, 409, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut)
                    }

                    bcrypt.compare(password, user[0].password, (error: NodeJS.ErrnoException, response: any) => {
                        if (error) {
                            handleHttpError(req, res, 409, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
                        }

                        if (response) {
                            req.session.userId = user[0]._id
                            req.session.error = null
                            res.redirect('/matches_overview')
                        } else {
                            handleHttpError(req, res, 409, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut)
                        }
                    })
                })
                .catch((error: mongoose.Error) => {
                    handleHttpError(req, res, 403, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
                })
        } else {
            handleHttpError(req, res, 400, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut)
        }
    }
}

export default handleSignIn
