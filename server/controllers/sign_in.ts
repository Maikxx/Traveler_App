import * as bcrypt from 'bcrypt'
import Profile from '../models/profile'
import handleHttpError from '../utils/handleError'

function handleSignIn (req: any, res: any) {
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
                        console.error('Authentication Failed!')
                        handleHttpError(req, res, 401, 'Authentication Failed', '/')
                    }

                    bcrypt.compare(password, user[0].password, (error, response) => {
                        if (error) {
                            console.error('Authentication Failed!')
                            handleHttpError(req, res, 401, 'Authentication Failed', '/')
                        }

                        if (response) {
                            req.session.userId = user[0]._id
                            req.session.error = null
                            res.redirect('/matches_overview')
                        } else {
                            console.error('Authentication Failed!')
                            handleHttpError(req, res, 401, 'Authentication Failed', '/')
                        }
                    })
                })
                .catch(error => {
                    console.error(error)
                    console.error('Authentication Failed!')
                    handleHttpError(req, res, 401, 'Authentication Failed', '/')
                })
        } else {
            handleHttpError(req, res, 400, 'Bad Request', '/')
        }
    }
}

export default handleSignIn
