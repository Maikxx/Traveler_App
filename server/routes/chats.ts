import * as express from 'express'
import Profile from '../models/profile'
import Chat from '../models/chat'
import { SessionType } from '../types/SessionType'
import handleHttpError from '../utils/handleError'
import { ProfileType } from 'server/types/profileType'
import { ChatType } from 'server/types/chatType'

function renderChats (req: express.Request & {session: SessionType}, res: express.Response) {
    req.session.error = null

    if (req.session && req.session.userId) {

        Profile.findOne({ _id: req.session.userId })
            .then((profileResult: ProfileType) => {

                Chat.find({ ownUserId: profileResult._id })
                    .then((chatResults: ChatType[]) => {
                        if (chatResults && chatResults.length) {
                            const openChatsData = chatResults.map((chatResult) => ({
                                _id: chatResult._id,
                                fullName: profileResult.fullName,
                                profileImageUrl: profileResult.profileImages
                                    && profileResult.profileImages.length
                                    && profileResult.profileImages[0].replace('public', ''),
                            }))

                            res.status(200).render('chats.ejs', { openChatsData })
                        } else {
                            res.render('chats.ejs', { openChatsData: [] })
                        }
                    })
                    .catch(error => {
                        console.error(error)
                        console.error('User ID and ownUserId do not match!')
                        handleHttpError(req, res, 500, 'Internal Server Error', '/')
                    })

            })
            .catch(error => {
                console.error(error)
                console.error('Invalid Own User ID!')
                handleHttpError(req, res, 500, 'Internal Server Error', '/')
            })

    } else {
        console.error('You need to be logged in to view your chats!')
        handleHttpError(req, res, 403, 'Forbidden', '/')
    }

    // const openChatsData = [
    //     {
    //         _id: '1',
    //         fullName: 'Henk Sneevliet',
    //         profileImageUrl: '/img/available-traveler.jpg',
    //     },
    //     {
    //         _id: '2',
    //         fullName: 'Henry voor \'t Schut',
    //         profileImageUrl: '/img/available-traveler.jpg',
    //     },
    // ]

    // res.render('chats.ejs', {
    //     openChatsData,
    // })
}

export default renderChats
