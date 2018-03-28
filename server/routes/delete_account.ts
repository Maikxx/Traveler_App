import * as fs from 'fs'
import * as express from 'express'
import * as mongoose from 'mongoose'

import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'
import { CustomErrorType } from '../types/customErrorType'

import handleHttpError from '../utils/handleError'

// Todo make this a DELETE route, instead of a get.

/*
Route for deleting users.

1. THe code looks for a valid profile and gets it from the database.
2. Delete all the profile images of this user, if he has any.
3. Delete the users account.
*/

function handleDeleteAccount (req: express.Request & {session: SessionType}, res: express.Response) {
    const cusErr = {
        redirectTo: '/',
        scope: 'delete_account',
        message: '',
        logOut: true,
    }

    if (req.session && req.session.userId) {
        Profile.findOne({ _id: req.session.userId })
            .then((result: ProfileType) => {
                const { profileImages } = result

                if (profileImages && profileImages.length) {
                    profileImages.forEach((imagePath: string) => {
                        fs.unlink(imagePath, (error: NodeJS.ErrnoException) => {
                            if (error) {
                                cusErr.message = 'There was an error unlinking an image!'

                                handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
                            }
                        })
                    })

                    deleteAccount(req, res, cusErr, req.session.userId)
                } else {
                    deleteAccount(req, res, cusErr, req.session.userId)
                }
            })
            .catch((error: mongoose.Error) => {
                cusErr.message = 'No such user exists!'

                handleHttpError(req, res, 401, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
            })
    } else {
        cusErr.message = 'You are not logged in!'

        handleHttpError(req, res, 401, cusErr.redirectTo, cusErr.scope, cusErr.message, true)
    }
}

function deleteAccount(req: express.Request & {session: SessionType}, res: express.Response, cusErr: CustomErrorType, userId: string) {
    Profile.remove({ _id: userId })
        .then(() => {
            res.status(204).redirect('/')
        })
        .catch((error: mongoose.Error) => {
            cusErr.message = 'There was an error while deleting your account!'

            handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
        })
}

export default handleDeleteAccount
