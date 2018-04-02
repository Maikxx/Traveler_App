import * as express from 'express'

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

async function renderIndex (req: express.Request & {session: SessionType}, res: express.Response, next: express.NextFunction) {
    if (process.env.NODE_ENV !== 'production') {
        if (req.session && req.session.error) {
            console.error(req.session.error)

            setTimeout(() => {
                req.session.error = null
            }, 3000)
        }
    }

    try {
        const availableTravelers = await Profile.find().limit(4) as ProfileType[]
        if (availableTravelers && availableTravelers.length) {
            const availableTravelersData = availableTravelers.map((availableTraveler: ProfileType) => ({
                _id: availableTraveler._id,
                fullName: availableTraveler.fullName,
                profileImage: availableTraveler.profileImages
                    && availableTraveler.profileImages[0] && availableTraveler.profileImages[0].replace('public', ''),
                profileDescription: availableTraveler.description,
            }))

            res.status(200).render('index.ejs', {
                availableTravelersData,
                error: req.session && req.session.error || null,
            })
        } else {
            res.status(500).render('index.ejs', {
                availableTravelersData: null,
                error: req.session && req.session.error,
            })
        }
    } catch (error) {
        next(error)
    }
}

export default renderIndex
