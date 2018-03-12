function renderChat (req: any, res: any) {
    const chatData = {
        chatId: '1',
        chatWithName: 'Henk',
        chatWithId: '1',
        messages: [
            {
                messageId: '1',
                sentByWho: 'me',
                profileImageUrl: '/img/available-traveler.jpg',
                sentBy: 'Henk',
                messageText: 'Hello there!',
            },
            {
                messageId: '2',
                sentByWho: 'them',
                profileImageUrl: '/img/available-traveler.jpg',
                sentBy: 'Me',
                messageText: 'Hello!',
            },
            {
                messageId: '3',
                sentByWho: 'me',
                profileImageUrl: '/img/available-traveler.jpg',
                sentBy: 'Henk',
                messageText: 'Hello thero!',
            },
            {
                messageId: '4',
                sentByWho: 'them',
                profileImageUrl: '/img/available-traveler.jpg',
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
