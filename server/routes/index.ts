import * as express from 'express'
import * as mongoose from 'mongoose'

import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

/*
Route that handles the index page requests (/)

~. There will be errors logged from here, if there are any, if the env is development.
~. There will be a few users, who are using Traveler, looked up and rendered to the page.
~. This route will also be a error container drop like place, where most users (depending if the error said the users log out)
will be sent if there goes something wrong.
*/

function renderIndex (errBack: express.Errback, req: express.Request & {session: SessionType}, res: express.Response) {
    if (process.env.NODE_ENV !== 'production') {
        if (req.session && req.session.error) {
            console.error(req.session.error)

            setTimeout(() => {
                req.session.error = null
            }, 3000)
        }
    }

    Profile.find()
        .limit(4)
        .then((results: ProfileType[]) => {
            if (results && results.length) {
                const availableTravelersData = results.map((result: ProfileType) => ({
                    _id: result._id,
                    fullName: result.fullName,
                    profileImage: result.profileImages && result.profileImages[0] && result.profileImages[0].replace('public', ''),
                    profileDescription: result.description,
                }))

                res.render('index.ejs', {
                    availableTravelersData,
                    error: req.session && req.session.error || null,
                })
            } else {
                renderErrorIndex(req, res)
            }
        })
        .catch((error: mongoose.Error) => {
            console.error(error)
            renderErrorIndex(req, res)
        })
}

function renderErrorIndex(req: express.Request & {session: SessionType}, res: express.Response) {
    res.status(500).render('index.ejs', {
        availableTravelersData: null,
        error: req.session.error,
    })
}

export default renderIndex
