import * as express from 'express'
import { sessionType } from '../types/sessionType'

function handleDeleteChat (req: express.Request & {session: sessionType}, res: express.Response) {
    const { _id } = req.params
    console.log(_id)

    res.redirect('/chats')
}

export default handleDeleteChat
