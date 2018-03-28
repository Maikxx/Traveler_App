import * as express from 'express'
import * as mongoose from 'mongoose'

import Profile from '../models/profile'
import Chat from '../models/chat'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/profileType'
import { ChatType } from '../types/chatType'

import handleHttpError from '../utils/handleError'

function renderChats (req: express.Request & {session: SessionType}, res: express.Response) {
    if (req.session && req.session.userId) {

        Profile.findOne({ _id: req.session.userId })
            .then((myProfile: ProfileType) => {
                if (myProfile.chats && myProfile.chats.length) {
                    Promise.all(myProfile.chats.map((chatId: string, i) => {
                        return Chat.findOne({ _id: chatId })
                            .then((chatResult: ChatType) => {
                                for (let i = 0; i < chatResult.chatParticipants.length; i++) {
                                    // tslint:disable-next-line:triple-equals
                                    if (chatResult.chatParticipants[i] != req.session.userId) {
                                        return Profile.findOne({ _id: chatResult.chatParticipants[i] })
                                            .then((chatWithProfile: ProfileType) => ({
                                                _id: chatResult._id,
                                                fullName: chatWithProfile.fullName,
                                                profileImageUrl: chatWithProfile.profileImages
                                                    && chatWithProfile.profileImages.length
                                                    && chatWithProfile.profileImages[0].replace('public', ''),
                                            }))
                                            .catch((error: mongoose.Error) => {
                                                // tslint:disable-next-line:ter-max-len
                                                handleHttpError(req, res, 500, '/', 'chats', 'Something went wrong with getting the profile of a chat!', false, error)
                                            })
                                    }
                                }
                            })
                            .catch((error: mongoose.Error) => {
                                // tslint:disable-next-line:ter-max-len
                                handleHttpError(req, res, 500, '/', 'chats', 'Something went wrong with getting the profile of a chat!', false, error)
                            })
                    }))
                        .then(rawData => {
                            const openChatsData = rawData.filter(data => data !== undefined)
                            res.status(200).render('chats.ejs', { openChatsData })
                        })
                        .catch((error: mongoose.Error) => {
                            handleHttpError(req, res, 500, '/', 'chats', 'Boiled up error in the Promise.all!', false, error)
                        })
                }
            })
            .catch((error: mongoose.Error) => {
                handleHttpError(req, res, 500, '/', 'chats', 'Invalid Own User ID!', false, error)
            })
    } else {
        handleHttpError(req, res, 403, '/', 'chats', 'You need to be logged in to view your chats!')
    }
}

export default renderChats
