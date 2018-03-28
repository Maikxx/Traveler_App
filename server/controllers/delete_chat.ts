import * as express from 'express'
import * as mongoose from 'mongoose'

import Chat from '../models/chat'
import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ChatType } from '../types/chatType'

import handleHttpError from '../utils/handleError'

/*
Controller which handles deleting chats.

Check if the user has a userId session.
Find a chat which corresponds with the id given by req.params.
Update both the profiles, which are linked to this chat, so that they no longer contain this chatId.
If deleting succeeds, navigate to the chats overview.
*/

function handleDeleteChat (req: express.Request & {session: SessionType}, res: express.Response) {
    const cusErr = {
        redirectTo: '/',
        scope: 'delete_chat',
        message: 'Authentication Failed!',
        logOut: true,
    }

    const { _id: chatId } = req.params

    if (req.session && req.session.userId) {
        Chat.findOne({ _id: chatId })
            .then((chatResult: ChatType) => {

                Promise.all(chatResult.chatParticipants.map((participantId) => {
                    return Profile.update({ _id: participantId }, { $pullAll: { chats: [ chatResult._id ] } })
                }))
                    .then(() => {
                        Chat.remove({ _id: chatResult._id })
                            .catch((error: mongoose.Error) => {
                                cusErr.message = 'Either the chatId does not exist, or you do not own the chat!'

                                handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
                            })

                        res.redirect('/chats')
                    })
                    .catch((error: mongoose.Error) => {
                        cusErr.message = 'There was an error updating one or more of the profiles!'

                        handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
                    })
            })
            .catch((error: mongoose.Error) => {
                cusErr.message = 'Can not find a chat with the passed id!'

                handleHttpError(req, res, 400, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
            })
    } else {
        cusErr.message = 'You must be logged in to delete a chat!'

        handleHttpError(req, res, 409, '/', cusErr.scope, cusErr.message, true)
    }
}

export default handleDeleteChat
