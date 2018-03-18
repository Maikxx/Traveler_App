function renderIndex (req: any, res: any) {
    const availableTravelersData = [
        {
            id: '1',
            name: 'Henk Sneevliet',
            profileImages: [ '/img/available-traveler.jpg' ],
            profileDescription: 'Henk loves to travel, just like you, otherwise you wouldn\'t be here, right?',
        },
        {
            id: '2',
            name: 'Frank Fransen',
            profileImages: [ '/img/available-traveler.jpg' ],
            profileDescription: 'Frank loves to travel, just like you, otherwise you wouldn\'t be here, right?',
        },
    ]

    res.render('index.ejs', {
        availableTravelersData,
    })
}

export default renderIndex
