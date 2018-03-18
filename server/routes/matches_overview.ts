function renderMatchesOverview (req: any, res: any) {
    const overviewData = [
        {
            profileId: '1',
            firstName: 'Henk',
            fullName: 'Henk Smits',
            profileImages: [ '/img/visitorProfileImages/1.1.jpg', '/img/visitorProfileImages/1.2.jpg' ],
            age: 31,
            description: 'Henk loves to travel, just like you, otherwise you wouldn\'t be here, right?',
            favouriteHolidayDestination: 'Dubai',
            likesToHike: 'Yes',
            favouriteOverallTravelTime: 3,
        },
        {
            profileId: '2',
            firstName: 'Henry',
            fullName: 'Henry Smits',
            profileImages: [ '/img/visitorProfileImages/1.1.jpg', '/img/visitorProfileImages/1.2.jpg' ],
            age: 31,
            description: 'Henry loves to travel, just like you, otherwise you wouldn\'t be here, right?',
            favouriteHolidayDestination: 'Dubai',
            likesToHike: 'No',
            favouriteOverallTravelTime: 5,
        },
    ]

    res.render('matches_overview.ejs', { overviewData })
}

export default renderMatchesOverview
