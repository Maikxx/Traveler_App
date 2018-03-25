import * as express from 'express'
import * as bcrypt from 'bcrypt'
import Profile from '../models/profile'
import handleHttpError from '../utils/handleError'
import { SessionType } from '../types/SessionType'

function handleSignIn (req: express.Request & {session: SessionType}, res: express.Response) {
    if (req.body) {
        const emailRegex = /^\w+@\w+\..{2,3}(.{2,3})?$/
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$/

        const {
            email,
            password,
        } = req.body

        if (
            (email.length && emailRegex.test(email)) &&
            (password.length && passwordRegex.test(password))
        ) {
            Profile.find({ email })
                .exec()
                .then((user: any) => {
                    if (!user.length) {
                        handleHttpError(
                            req,
                            res,
                            409,
                            '/',
                            'log_in',
                            'Authentication Failed!',
                            false
                        )
                    }

                    bcrypt.compare(password, user[0].password, (error, response) => {
                        if (error) {
                            handleHttpError(
                                req,
                                res,
                                409,
                                '/',
                                'log_in',
                                'Authentication Failed!',
                                false,
                                error
                            )
                        }

                        if (response) {
                            req.session.userId = user[0]._id
                            req.session.error = null
                            res.redirect('/matches_overview')
                        } else {
                            handleHttpError(
                                req,
                                res,
                                409,
                                '/',
                                'log_in',
                                'Authentication Failed!',
                                false
                            )
                        }
                    })
                })
                .catch(error => {
                    handleHttpError(
                        req,
                        res,
                        403,
                        '/',
                        'log_in',
                        'Authentication Failed!',
                        false,
                        error
                    )
                })
        } else {
            handleHttpError(
                req,
                res,
                400,
                '/',
                'log_in',
                'Authentication Failed!',
                false
            )
        }
    }
}

export default handleSignIn
