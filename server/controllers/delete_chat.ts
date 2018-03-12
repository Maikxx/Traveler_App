function handleDeleteChat (req: any, res: any) {
    const { id } = req.params
    console.log(id)

    res.redirect('/chats')
}

export default handleDeleteChat
