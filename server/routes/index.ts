import * as express from 'express'
import Profile from '../models/profile'
import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

function renderIndex (req: express.Request & {session: SessionType}, res: express.Response) {
    if (req.session.error) {
        console.error(req.session.error)
    }

    Profile.find()
        .limit(4)
        .then((results: ProfileType[]) => {
            if (results && results.length) {
                const availableTravelersData = results.map(result => ({
                    _id: result._id,
                    fullName: result.fullName,
                    profileImage: result.profileImages && result.profileImages[0] && result.profileImages[0].replace('public', ''),
                    profileDescription: result.description,
                }))

                res.render('index.ejs', {
                    availableTravelersData,
                    error: req.session.error || null,
                })
            } else {
                res.status(500).render('index.ejs')
            }
        })
}

export default renderIndex
