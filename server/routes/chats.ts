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
            .then((myProfile: ProfileType) => {
                if (myProfile.chats && myProfile.chats.length) {
                    Promise.all(myProfile.chats.map((chatId: string, i) => {

                        return Chat.findOne({ _id: chatId })
                            .then((chatResult: ChatType) => {
                                console.log(myProfile._id, chatResult.chatWithId)
                                console.log(myProfile._id, chatResult.ownUserId)

                                if (myProfile._id !== chatResult.ownUserId) {
                                    return Profile.findOne({ _id: chatResult.ownUserId })
                                        .then((chatWithProfile: ProfileType) => {
                                            return {
                                                _id: chatResult._id,
                                                fullName: chatWithProfile.fullName,
                                                profileImageUrl: chatWithProfile.profileImages
                                                    && chatWithProfile.profileImages.length
                                                    && chatWithProfile.profileImages[0].replace('public', ''),
                                            }
                                        })
                                        .catch(error => {
                                            handleHttpError(
                                                req,
                                                res,
                                                500,
                                                '/',
                                                'chats',
                                                'Something went wrong with getting the profile of a chat!',
                                                error
                                            )
                                        })
                                } else {
                                    return Profile.findOne({ _id: chatResult.chatWithId })
                                        .then((chatFromProfile: ProfileType) => {
                                            return {
                                                _id: chatResult._id,
                                                fullName: chatFromProfile.fullName,
                                                profileImageUrl: chatFromProfile.profileImages
                                                    && chatFromProfile.profileImages.length
                                                    && chatFromProfile.profileImages[0].replace('public', ''),
                                            }
                                        })
                                        .catch(error => {
                                            handleHttpError(
                                                req,
                                                res,
                                                500,
                                                '/',
                                                'chats',
                                                'Something went wrong with getting the profile of a chat!',
                                                error
                                            )
                                        })
                                }
                            })
                            .catch(error => {
                                handleHttpError(
                                    req,
                                    res,
                                    500,
                                    '/',
                                    'chats',
                                    'Something went wrong with getting the profile of a chat!',
                                    error
                                )
                            })
                    }))
                        .then(openChatsData => {
                            res.status(200).render('chats.ejs', { openChatsData })
                        })
                        .catch(error => {
                            handleHttpError(
                                req,
                                res,
                                500,
                                '/',
                                'chats',
                                'Something went wrong inside the Promises to get all the users who you chat with!',
                                error
                            )
                        })
                }
            })
            .catch(error => {
                handleHttpError(
                    req,
                    res,
                    500,
                    '/',
                    'chats',
                    'Invalid Own User ID!',
                    error
                )
            })
    } else {
        handleHttpError(
            req,
            res,
            403,
            '/',
            'chats',
            'You need to be logged in to view your chats!'
        )
    }
}

export default renderChats
