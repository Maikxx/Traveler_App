import * as fs from 'fs'
import * as express from 'express'
import Profile from '../models/profile'
import handleHttpError from '../utils/handleError'
import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

function handleDeleteAccount (req: express.Request & {session: SessionType}, res: express.Response) {
    if (req.session && req.session.userId) {
        Profile.findOne({ _id: req.session.userId })
            .then((result: ProfileType) => {
                if (result) {
                    const { profileImages } = result

                    if (profileImages && profileImages.length) {
                        profileImages.forEach((image) => {
                            fs.unlink(image, (error) => {
                                if (error) {
                                    console.error(error)
                                    handleHttpError(req, res, 500, 'Internal Server Error', '/')
                                }
                            })
                        })

                        req.session.destroy(error => {
                            if (error) {
                                console.error(error)
                                handleHttpError(req, res, 500, 'Internal Server Error', '/')
                            } else {
                                res.status(200).redirect('/')
                            }
                        })
                    }
                }
            })
            .catch(error => {
                console.error(error)
                console.error('No such user exists!')
                handleHttpError(req, res, 401, 'Authentication Failed', '/')
            })
    } else {
        console.error('You are not logged in!')
        handleHttpError(req, res, 401, 'Creditentials Required', '/')
    }
}

export default handleDeleteAccount
