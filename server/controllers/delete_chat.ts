import * as express from 'express'
import { SessionType } from '../types/SessionType'
import handleHttpError from '../utils/handleError'
import Chat from '../models/chat'
import Profile from '../models/profile'
import { ChatType } from 'server/types/chatType'

function handleDeleteChat (req: express.Request & {session: SessionType}, res: express.Response) {
    const { _id: chatId } = req.params

    if (req.session && req.session.userId) {
        Chat.findOne({ _id: chatId })
            .then((chatResult: ChatType) => {
                Profile.update({ _id: chatResult.chatWithId }, { $pullAll: { chats: [ chatId ] } })
                    .then(() => {
                        Profile.update({ _id: chatResult.ownUserId }, { $pullAll: { chats: [ chatId ] } })
                            .then(() => {
                                Chat.remove({ _id: chatId })
                                    .catch(error => {
                                        handleHttpError(
                                            req,
                                            res,
                                            400,
                                            '/',
                                            'delete_chat',
                                            'Either the chatId does not exist, or you do not own the chat!',
                                            error
                                        )
                                    })

                                res.redirect('/chats')
                            })
                            .catch(error => {
                                handleHttpError(
                                    req,
                                    res,
                                    400,
                                    '/',
                                    'delete_chat',
                                    'Cannot update the second profile!',
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
                            'Cannot update first profile!',
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
                    error
                )
            })
    }
}

export default handleDeleteChat
