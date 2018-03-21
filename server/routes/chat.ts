import * as express from 'express'
import { sessionType } from '../types/sessionType'

function renderChat (req: express.Request & {session: sessionType}, res: express.Response) {
    const chatData = {
        chatId: '1',
        chatWithName: 'Henk',
        chatWithId: '1',
        messages: [
            {
                messageId: '1',
                sentByWho: 'me',
                sentBy: 'Henk',
                messageText: 'Hello there!',
            },
            {
                messageId: '2',
                sentByWho: 'them',
                sentBy: 'Me',
                messageText: 'Hello!',
            },
            {
                messageId: '3',
                sentByWho: 'me',
                sentBy: 'Henk',
                messageText: 'Hello thero!',
            },
            {
                messageId: '4',
                sentByWho: 'them',
                sentBy: 'Me',
                messageText: 'Hellooo!',
            },
        ],
        nextMessageId: '5',
    }

    res.render('chat.ejs', {
        chatData,
    })
}

export default renderChat
