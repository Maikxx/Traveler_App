function handleSendMessage (req: any, res: any) {
    const message = req.body['tl-chat-input']
    console.log(message)

    res.redirect('/chat/1')
}

export default handleSendMessage
