function handleDeleteChat (req: any, res: any) {
    const { _id } = req.params
    console.log(_id)

    res.redirect('/chats')
}

export default handleDeleteChat
