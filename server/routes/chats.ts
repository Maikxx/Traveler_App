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
                                            .catch(error => {
                                                handleHttpError(
                                                    req,
                                                    res,
                                                    500,
                                                    '/',
                                                    'chats',
                                                    'Something went wrong with getting the profile of a chat!',
                                                    true,
                                                    error
                                                )
                                            })
                                    }
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
                                    true,
                                    error
                                )
                            })
                    }))
                        .then(rawData => {
                            const openChatsData = rawData.filter(data => data !== undefined)
                            res.status(200).render('chats.ejs', { openChatsData })
                        })
                        .catch(error => {
                            handleHttpError(
                                req,
                                res,
                                500,
                                '/',
                                'chats',
                                'Boiled up error in the Promise.all!',
                                true,
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
                    true,
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
