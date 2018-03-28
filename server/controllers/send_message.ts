import * as express from 'express'
import * as mongoose from 'mongoose'

import Chat from '../models/chat'
import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ChatType } from '../types/chatType'

import handleHttpError from '../utils/handleError'
import { ProfileType } from '../types/ProfileType'

/*
Controller that handles sending messages.

The user is checked for existance and after that the message construction is set up.
When the chat is updated, there is a message pushed to the messages array of the chat in question.
If that succeeds the user is redirected to their chat.
*/

function handleSendMessage (req: express.Request & {session: SessionType}, res: express.Response) {
    const cusErr = {
        redirectTo: '/chats',
        scope: 'send_message',
        message: '',
        logOut: false,
    }

    if (req.session && req.session.userId) {
        Profile.findById(req.session.userId)
            .then((result: ProfileType) => {
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
                            res.status(201).redirect(`/chat/${chatId}`)
                        })
                        .catch((error: mongoose.Error) => {
                            cusErr.message = 'Something went wrong with getting a chat!'

                            handleHttpError(req, res, 400, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
                        })
                } else {
                    cusErr.message = 'You can not have empty messages!'

                    handleHttpError(req, res, 400, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut)
                }
            })
            .catch((error: mongoose.Error) => {
                cusErr.message = 'Your userId does not exist in our database, you are now logged out!'

                handleHttpError(req, res, 409, '/', cusErr.scope, cusErr.message, true, error)
            })
    } else {
        cusErr.message = 'You need to be logged in to send a message!'

        handleHttpError(req, res, 401, '/', cusErr.scope, cusErr.message, true)
    }
}

export default handleSendMessage
