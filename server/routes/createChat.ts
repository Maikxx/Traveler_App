import * as express from 'express'
import * as mongoose from 'mongoose'

import Chat from '../models/chat'
import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'
import { ChatType } from '../types/chatType'

import handleHttpError from '../utils/handleError'

/*
Route for creating a new chat, if the user clicks on the chat button for the first time with someone.

1. THe code looks for a valid profile and gets it from the database.
2. Create a new chat instance and save it to the database.
3. Find this recently added chat and loop over its participants.
4. For each of these participants, their profile gets updated, with the chatId added to their array of chatIds.
*/

function createChat (req: express.Request & {session: SessionType}, res: express.Response) {
    const cusErr = {
        redirectTo: '/',
        scope: 'createChat',
        message: '',
        logOut: false,
    }

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
                                        .catch((error: mongoose.Error) => {
                                            cusErr.message = 'Internal Server Error!'

                                            handleHttpError(req, res, 500, cusErr.redirectTo,
                                                cusErr.scope, cusErr.message, cusErr.logOut, error)
                                        })
                                }))
                                    .then(() => {
                                        res.redirect(`/chat/${chatResult._id}`)
                                    })
                                    .catch((error: mongoose.Error) => {
                                        cusErr.message = 'Error while getting back the saved chat!'

                                        handleHttpError(req, res, 500, cusErr.redirectTo,
                                            cusErr.scope, cusErr.message, cusErr.logOut, error)
                                    })
                            })
                            .catch((error: mongoose.Error) => {
                                cusErr.message = 'Error while getting back the saved chat!'

                                handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
                            })
                    })
                    .catch((error: mongoose.Error) => {
                        cusErr.message = 'Error while saving a new chat!'

                        handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
                    })
            })
            .catch((error: mongoose.Error) => {
                cusErr.message = 'Invalid lastMatchId!'

                handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
            })
    } else {
        cusErr.message = 'You need to be logged in to create a chat!'

        handleHttpError(req, res, 403, cusErr.redirectTo, cusErr.scope, cusErr.message, true)
    }
}

export default createChat
