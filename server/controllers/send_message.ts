import * as express from 'express'
// import * as mongoose from 'mongoose'
import { SessionType } from '../types/SessionType'
import handleHttpError from '../utils/handleError'

function handleSendMessage (req: express.Request & {session: SessionType}, res: express.Response) {
    if (req.session && req.session.userId) {
        const { message } = req.body

        // const newMessage = new Message({
        //     _id: new mongoose.Types.ObjectId(),
        //     messageById: req.session.userId,
        //     messageText: message,
        // })

        console.log(message)

        res.redirect('/chat/1')
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
