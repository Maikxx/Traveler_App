import * as express from 'express'
import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from 'server/types/ProfileType'

import handleHttpError from '../utils/handleError'

/*
Controller that handles signing new users up.

The data gets tested, before it is stored in Mongo.
There are checks to see if a Profile already exists, if the data is valid and if the user filled in everything the right way.
If everything succeeds the new user will be stored in the database and the user will be redirected to the questionaire page.
*/

function handleSignUp (req: express.Request & {session: SessionType}, res: express.Response) {
    const customError = {
        redirectTo: '/',
        scope: 'sign_up',
        message: '',
        logOut: false,
    }

    const emailRegex = /^\w+@\w+\..{2,3}(.{2,3})?$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$/

    if (req.body) {
        const {
            fullName,
            email,
            password,
            repeatPassword,
            ownGender,
            lookingForGender,
        } = req.body

        if (
            email && email.length && emailRegex.test(email) &&
            fullName && fullName.length &&
            password && password.length && passwordRegex.test(password) && repeatPassword === password &&
            ownGender && ownGender.length &&
            lookingForGender && lookingForGender.length
        ) {
            Profile.find({ email: email.toLowerCase() })
                .exec()
                .then((user: ProfileType[]) => {
                    if (user && user.length) {
                        customError.message = 'Mail already exists!'

                        handleHttpError(req, res, 409, customError.redirectTo, customError.scope, customError.message, false)
                    } else {
                        bcrypt.hash(req.body.password, 10, (error: NodeJS.ErrnoException, hash: string) => {
                            if (error) {
                                customError.message = 'Uncaught error!'

                                handleHttpError(req, res, 400, customError.redirectTo,
                                    customError.scope, customError.message, customError.logOut, error)
                            } else {
                                const newUser = new Profile({
                                    _id: new mongoose.Types.ObjectId(),
                                    fullName,
                                    firstName: fullName && fullName.length && fullName.substr(0, fullName.indexOf(' ')),
                                    email: email.toLowerCase(),
                                    password: hash,
                                    ownGender,
                                    matchSettings: {
                                        lookingForGender,
                                    },
                                })

                                newUser.save()
                                    .then((result: ProfileType) => {
                                        req.session.userId = result._id
                                        req.session.error = null
                                        res.status(200).redirect(`/questionaire`)
                                    })
                                    .catch((error: mongoose.NativeError) => {
                                        customError.message = 'Error while saving a new user!'

                                        handleHttpError(req, res, 500, customError.redirectTo,
                                            customError.scope, customError.message, customError.logOut, error)
                                    })
                            }
                        })
                    }
                })
                .catch((error: mongoose.NativeError) => {
                    customError.message = 'Something went wrong with getting your mail!'

                    handleHttpError(req, res, 500, customError.redirectTo,
                        customError.scope, customError.message, customError.logOut, error)
                })
        } else {
            customError.message = 'Mail is not valid!'

            handleHttpError(req, res, 422, customError.redirectTo, customError.scope, customError.message, customError.logOut)
        }
    } else {
        customError.message = 'We did not receive any form data from you! Please try again!'

        handleHttpError(req, res, 400, customError.redirectTo, customError.scope, customError.message, customError.logOut)
    }
}

export default handleSignUp
