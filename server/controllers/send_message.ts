import * as express from 'express'
import { sessionType } from '../types/sessionType'

function handleSendMessage (req: express.Request & {session: sessionType}, res: express.Response) {
    const { message } = req.body

    console.log(message)

    res.redirect('/chat/1')
}

export default handleSendMessage
