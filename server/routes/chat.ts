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

                Profile.findOne({ _id: chatResult.chatWithId })
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
                            '/matches_overview',
                            'chat',
                            'Something went wrong inside of the finding of the person who you chat with!',
                            error
                        )
                    })
            })
            .catch(error => {
                handleHttpError(
                    req,
                    res,
                    500,
                    '/matches_overview',
                    'chat',
                    'Invalid newChatId',
                    error
                )
            })
    } else {
        handleHttpError(
            req,
            res,
            403,
            '/matches_overview',
            'chat',
            'You need to be logged in to send a message!'
        )
    }

    // const chatData = {
    //     chatId: '1',
    //     chatWithName: 'Henk',
    //     chatWithId: '1',
    //     messages: [
    //         {
    //             messageId: '1',
    //             sentByWho: 'me',
    //             sentBy: 'Henk',
    //             messageText: 'Hello there!',
    //         },
    //         {
    //             messageId: '2',
    //             sentByWho: 'them',
    //             sentBy: 'Maikel',
    //             messageText: 'Hello!',
    //         },
    //         {
    //             messageId: '3',
    //             sentByWho: 'me',
    //             sentBy: 'Henk',
    //             messageText: 'Hello thero!',
    //         },
    //         {
    //             messageId: '4',
    //             sentByWho: 'them',
    //             sentBy: 'Maikel',
    //             messageText: 'Hellooo!',
    //         },
    //     ],
    // }
}

export default renderChat
