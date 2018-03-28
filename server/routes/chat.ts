import * as express from 'express'
import * as mongoose from 'mongoose'

import Chat from '../models/chat'
import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'
import { ChatType, MessageType } from '../types/chatType'

import handleHttpError from '../utils/handleError'

/*
Route for handling /chat requests.

1. Checks if the user exists and is logged in, then it will get the chat requested (via params) from the database.
2. It will then loop over all the chat participantsIds and get their profiles.
3. This needs to be done in order for the chatData to be complete (you need a name of the person you chat with etc.)
*/

function renderChat (req: express.Request & {session: SessionType}, res: express.Response) {
    const cusErr = {
        redirectTo: '/',
        scope: 'chat',
        message: '',
        logOut: false,
    }

    if (req.session && req.session.userId) {
        const { _id: chatId } = req.params

        Profile.findOne({ _id: req.session.userId })
            .then((myProfile) => {
                Chat.findOne({ _id: chatId })
                    .then((chatResult: ChatType) => {

                        chatResult.chatParticipants.map((participantId: string) => {
                            // tslint:disable-next-line:triple-equals
                            if (participantId != myProfile._id) {
                                Profile.findOne({ _id: participantId })
                                    .then((chatWithProfile: ProfileType) => {

                                        res.render('chat.ejs', {
                                            chatData: {
                                                chatId,
                                                chatWithName: chatWithProfile.firstName,
                                                chatWithId: chatWithProfile._id,
                                                messages: chatResult.messages
                                                    && chatResult.messages.length
                                                    && chatResult.messages.map((message: MessageType) => ({
                                                        messageById: message.messageById,
                                                        messageText: message.messageText,
                                                        sentByWho: req.session.userId === message.messageById ? 'me' : 'them',
                                                    })),
                                            },
                                        })
                                    })
                                    .catch((error: mongoose.Error) => {
                                        cusErr.message = 'Something went wrong inside the server, please try again!'

                                        handleHttpError(req, res, 500, cusErr.redirectTo,
                                            cusErr.scope, cusErr.message, cusErr.logOut, error)
                                    })
                            }
                        })
                    })
                    .catch((error: mongoose.Error) => {
                        cusErr.message = 'Something went wrong inside the server, please try again!'

                        handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
                    })
            })
            .catch((error: mongoose.Error) => {
                cusErr.message = 'Invalid userId!'

                handleHttpError(req, res, 400, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
            })
    } else {
        cusErr.message = 'You need to be logged in to send a message!'

        handleHttpError(req, res, 401, cusErr.redirectTo, cusErr.scope, cusErr.message, true)
    }
}

export default renderChat
