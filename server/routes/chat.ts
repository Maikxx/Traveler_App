import * as express from 'express'
import * as mongoose from 'mongoose'
import Chat from '../models/chat'
import Profile from '../models/profile'
import { SessionType } from '../types/SessionType'
import { ProfileType } from 'server/types/ProfileType'
import handleHttpError from '../utils/handleError'
import { ChatType } from 'server/types/chatType'

function renderChat (req: express.Request & {session: SessionType}, res: express.Response) {
    if (req.session && req.session.userId && req.session.lastMatchId) {

        Profile.findOne({ _id: req.session.lastMatchId })
            .then((chatWithProfile: ProfileType) => {
                const newChat = new Chat({
                    _id: new mongoose.Types.ObjectId(),
                    ownUserId: req.session.userId,
                    chatWithId: chatWithProfile._id,
                    messages: [],
                })

                newChat.save()
                    .then(() => {
                        Chat.findOne({ _id: newChat._id })
                            .then((chatResult: ChatType) => {
                                const chatData = {
                                    chatId: newChat._id,
                                    chatWithName: chatWithProfile.firstName,
                                    chatWithId: chatWithProfile._id,
                                    messages: chatResult.messages,
                                }

                                res.render('chat.ejs', { chatData })
                            })
                            .catch(error => {
                                console.error(error)
                                console.error('Invalid newChatId')
                                handleHttpError(req, res, 500, 'Internal Server Error', '/chats')
                            })
                    })
                    .catch(error => {
                        console.error(error)
                        console.error('Error while saving a new chat')
                        handleHttpError(req, res, 500, 'Internal Server Error', '/chats')
                    })
            })
            .catch(error => {
                console.error(error)
                console.error('Invalid lastMatchId')
                handleHttpError(req, res, 500, 'Internal Server Error', '/chats')
            })
    } else {
        console.error('You need to be logged in to send a message!')
        handleHttpError(req, res, 403, 'Forbidden', '/')
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
