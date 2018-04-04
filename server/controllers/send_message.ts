import * as express from 'express'

import Chat from '../models/chat'
import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'

import { ProfileType } from '../types/ProfileType'

/*
Controller that handles sending messages.

1. The user is checked for existance and after that the message construction is set up.
2. When the chat is updated, there is a message pushed to the messages array of the chat in question.
3. If that succeeds the user is redirected to their chat.
*/

async function handleSendMessage (req: express.Request & {session: SessionType}, res: express.Response, next: express.NextFunction) {
    const cusErr = {
        code: 500,
        redirectTo: '/chats',
        scope: 'send_message',
        message: '',
        logOut: false,
    }

    if (req.session && req.session.userId) {
        try {
            const myProfile = await Profile.findOne({ _id: req.session.userId }) as ProfileType

            if (!myProfile.hasFinishedQuestionaire) {
                throw new Error('You have not yet filled in the questionaire!')
            } else {
                const { userId: messageById } = req.session
                const { message: messageText } = req.body
                const { _id: chatId } = req.params

                if (messageText && messageText.length) {
                    const newMessage = {
                        messageById,
                        messageText,
                    }

                    await Chat.update({ _id: chatId }, { $push: { messages: newMessage } })
                    res.status(201).redirect(`/chat/${chatId}`)
                } else {
                    throw new Error('You can not have empty messages!')
                }
            }
        } catch (error) {
            next(error)
        }
    } else {
        cusErr.code = 401
        cusErr.redirectTo = '/'
        cusErr.logOut = true
        cusErr.message = 'You need to be logged in to save this questionaire!'

        next(cusErr)
    }
}

export default handleSendMessage
