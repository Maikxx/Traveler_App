import * as express from 'express'
import { SessionType } from '../types/SessionType'
import handleHttpError from '../utils/handleError'
import Chat from '../models/chat'
import { ChatType } from 'server/types/chatType'

function handleSendMessage (req: express.Request & {session: SessionType}, res: express.Response) {
    if (req.session && req.session.userId) {
        const { userId: messageById } = req.session
        const { message: messageText } = req.body
        const { _id: chatId } = req.params

        if (messageText && messageText.length) {
            const newMessage = {
                messageById,
                messageText,
            }

            Chat.update({ _id: chatId }, { $push: { messages: newMessage } })
                .then((result: ChatType) => {
                    res.redirect(`/chat/${chatId}`)
                })
                .catch(error => {
                    handleHttpError(
                        req,
                        res,
                        500,
                        '/chats',
                        'send_message',
                        'Something went wrong with getting a chat!',
                        error
                    )
                })
        } else {
            handleHttpError(
                req,
                res,
                400,
                '/chats',
                'send_message',
                'You can not have empty messages!'
            )
        }
    } else {
        handleHttpError(
            req,
            res,
            403,
            '/chats',
            'send_message',
            'You need to be logged in to send a message!'
        )
    }
}

export default handleSendMessage
