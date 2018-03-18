function renderChats (req: any, res: any) {
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
