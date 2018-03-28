import * as express from 'express'
import * as mongoose from 'mongoose'
import Chat from '../models/chat'
import Profile from '../models/profile'
import { SessionType } from '../types/SessionType'
import { ProfileType } from 'server/types/ProfileType'
import handleHttpError from '../utils/handleError'
import { ChatType } from 'server/types/chatType'

function createChat (req: express.Request & {session: SessionType}, res: express.Response) {
    if (req.session && req.session.userId && req.session.lastMatchId) {

        Profile.findOne({ _id: req.session.lastMatchId })
            .then((chatWithProfile: ProfileType) => {
                const newChat = new Chat({
                    _id: new mongoose.Types.ObjectId(),
                    chatParticipants: [ req.session.userId, chatWithProfile._id ],
                    ownUserId: req.session.userId,
                    chatWithId: chatWithProfile._id,
                    messages: [],
                })

                newChat.save()
                    .then(() => {
                        Chat.findOne({ _id: newChat._id })
                            .then((chatResult: ChatType) => {
                                Promise.all(chatResult.chatParticipants && chatResult.chatParticipants.map((participantId) => {
                                    return Profile.update({ _id: participantId }, { $push: { chats: chatResult._id } })
                                        .catch(error => {
                                            handleHttpError(
                                                req,
                                                res,
                                                500,
                                                '/',
                                                'createChat',
                                                `Error while saving profile ${participantId}!`,
                                                true,
                                                error
                                            )
                                        })
                                }))
                                    .then(() => {
                                        res.redirect(`/chat/${chatResult._id}`)
                                    })
                                    .catch(error => {
                                        handleHttpError(
                                            req,
                                            res,
                                            500,
                                            '/',
                                            'createChat',
                                            'Error while getting back the saved chat!',
                                            true,
                                            error
                                        )
                                    })
                            })
                            .catch(error => {
                                handleHttpError(
                                    req,
                                    res,
                                    500,
                                    '/',
                                    'createChat',
                                    'Error while getting back the saved chat!',
                                    true,
                                    error
                                )
                            })
                    })
                    .catch(error => {
                        handleHttpError(
                            req,
                            res,
                            500,
                            '/',
                            'createChat',
                            'Error while saving a new chat',
                            true,
                            error
                        )
                    })
            })
            .catch(error => {
                handleHttpError(
                    req,
                    res,
                    500,
                    '/',
                    'createChat',
                    'Invalid lastMatchId!',
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
            'createChat',
            'You need to be logged in to create a chat!'
        )
    }
}

export default createChat
