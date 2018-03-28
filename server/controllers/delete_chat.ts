import * as express from 'express'

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
    const { _id: chatId } = req.params

    if (req.session && req.session.userId) {
        Chat.findOne({ _id: chatId })
            .then((chatResult: ChatType) => {

                Promise.all(chatResult.chatParticipants.map((participantId) => {
                    return Profile.update({ _id: participantId }, { $pullAll: { chats: [ chatResult._id ] } })
                }))
                    .then(() => {
                        Chat.remove({ _id: chatResult._id })
                            .catch(error => {

                                handleHttpError(
                                    req,
                                    res,
                                    500,
                                    '/',
                                    'delete_chat',
                                    'Either the chatId does not exist, or you do not own the chat!',
                                    true,
                                    error
                                )
                            })

                        res.redirect('/chats')
                    })
                    .catch(error => {
                        handleHttpError(
                            req,
                            res,
                            500,
                            '/',
                            'delete_chat',
                            'There was an error updating one or more of the profiles',
                            true,
                            error
                        )
                    })
            })
            .catch(error => {
                handleHttpError(
                    req,
                    res,
                    400,
                    '/',
                    'delete_chat',
                    'Can not find a chat with the passed id!',
                    true,
                    error
                )
            })
    } else {
        handleHttpError(
            req,
            res,
            409,
            '/',
            'delete_chat',
            'You must be logged in to delete a chat!',
            true
        )
    }
}

export default handleDeleteChat
