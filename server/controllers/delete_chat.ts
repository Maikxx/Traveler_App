import * as express from 'express'
import { SessionType } from '../types/SessionType'

function handleDeleteChat (req: express.Request & {session: SessionType}, res: express.Response) {
    const { _id } = req.params
    console.log(_id)

    res.redirect('/chats')
}

export default handleDeleteChat
