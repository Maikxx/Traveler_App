import * as express from 'express'
import { SessionType } from '../types/SessionType'
import handleHttpError from '../utils/handleError'
import Chat from '../models/chat'

function handleDeleteChat (req: express.Request & {session: SessionType}, res: express.Response) {
    const { _id: chatId } = req.params

    if (req.session && req.session.userId) {
        Chat.remove({ _id: chatId, ownUserId: req.session.userId })
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
    }

    res.redirect('/chats')
}

export default handleDeleteChat
