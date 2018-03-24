import * as express from 'express'
import { SessionType } from '../types/SessionType'
import handleHttpError from '../utils/handleError'
import Chat from '../models/chat'

function handleDeleteChat (req: express.Request & {session: SessionType}, res: express.Response) {
    const { _id: chatId } = req.params

    if (req.session && req.session.userId) {
        Chat.remove({ _id: chatId, ownUserId: req.session.userId })
            .catch(error => {
                console.error(error)
                console.error('Either the chatId does not exist, or you do not own the chat!')
                handleHttpError(req, res, 400, 'Bad Request', '/')
            })
    }

    res.redirect('/chats')
}

export default handleDeleteChat
