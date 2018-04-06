import * as express from 'express'
import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

import validationRegex from '../utils/regex'
import errorMessages from '../utils/errorMessages'

/*
Controller that handles signing new users up.

1. The data gets tested, before it is stored in Mongo.
2. There are checks to see if a Profile already exists, if the data is valid and if the user filled in everything the right way.
3. If everything succeeds the new user will be stored in the database and the user will be redirected to the questionaire page.
*/

async function handleSignUp (req: express.Request & {session: SessionType}, res: express.Response, next: express.NextFunction) {
    const cusErr = {
        req,
        res,
        code: 412,
        redirectTo: '/',
        scope: 'sign_up',
        message: errorMessages.requiredFieldMissingOrInvalid,
        logOut: false,
    }

    const {
        fullName,
        email,
        password,
        repeatPassword,
        ownGender,
        lookingForGender,
    } = req.body

    if (
        email && email.length && validationRegex.email.test(email) &&
        fullName && fullName.length &&
        password && password.length && validationRegex.password.test(password) && repeatPassword === password &&
        ownGender && ownGender.length &&
        lookingForGender && lookingForGender.length
    ) {
        try {
            const lookupProfile = await Profile.findOne({ email: email.toLowerCase() }) as ProfileType

            if (!lookupProfile) {
                bcrypt.hash(req.body.password, 10, async (error: NodeJS.ErrnoException, hash: string) => {
                    if (error) {
                        cusErr.code = 500
                        cusErr.message = errorMessages.serverError

                        next(cusErr)
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
                            hasFinishedQuestionaire: false,
                        })

                        const myProfile = await newUser.save() as ProfileType
                        req.session.userId = myProfile._id
                        req.session.error = null

                        res.status(200).redirect(`/questionaire`)
                    }
                })
            } else {
                cusErr.code = 400
                cusErr.message = 'You can not sign up a new user with an existing e-mail address!'

                next(cusErr)
            }
        } catch (error) {
            next(error)
        }
    } else {
        next(cusErr)
    }
}

export default handleSignUp
