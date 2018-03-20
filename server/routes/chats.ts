import * as express from 'express'
import { sessionType } from '../types/sessionType'

function renderChats (req: express.Request & {session: sessionType}, res: express.Response) {
    const openChatsData = [
        {
            _id: '1',
            fullName: 'Henk Sneevliet',
            profileImageUrl: '/img/available-traveler.jpg',
            lastMessage: {
                _id: '1',
                content: 'Hi Henk! Everything good?',
                byWho: 'me',
            },
        },
        {
            _id: '2',
            fullName: 'Henry voor \'t Schut',
            profileImageUrl: '/img/available-traveler.jpg',
            lastMessage: {
                _id: '1',
                content: 'Hi Larissa! Everything good?',
                byWho: 'them',
            },
        },
    ]

    res.render('chats.ejs', {
        openChatsData,
    })
}

export default renderChats
