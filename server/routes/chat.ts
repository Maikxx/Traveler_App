import * as express from 'express'
import Chat from '../models/chat'
import Profile from '../models/profile'
import { SessionType } from '../types/SessionType'
import { ProfileType } from 'server/types/ProfileType'
import handleHttpError from '../utils/handleError'
import { ChatType, MessageType } from 'server/types/chatType'

function renderChat (req: express.Request & {session: SessionType}, res: express.Response) {
    if (req.session && req.session.userId) {
        const { _id: chatId } = req.params

        Chat.findOne({ _id: chatId })
            .then((chatResult: ChatType) => {

                chatResult.chatParticipants.map((participantId) => {
                    // tslint:disable-next-line:triple-equals
                    if (participantId != req.session.userId) {
                        Profile.findOne({ _id: participantId })
                            .then((chatWithProfile: ProfileType) => {
                                const chatData = {
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
                                }

                                res.render('chat.ejs', { chatData })
                            })
                            .catch(error => {
                                handleHttpError(
                                    req,
                                    res,
                                    500,
                                    '/',
                                    'chat',
                                    'Something went wrong inside of the finding of the person who you chat with!',
                                    true,
                                    error
                                )
                            })
                    }
                })
            })
            .catch(error => {
                handleHttpError(
                    req,
                    res,
                    500,
                    '/',
                    'chat',
                    'Invalid newChatId',
                    true,
                    error
                )
            })
    } else {
        handleHttpError(
            req,
            res,
            401,
            '/',
            'chat',
            'You need to be logged in to send a message!'
        )
    }
}

export default renderChat
