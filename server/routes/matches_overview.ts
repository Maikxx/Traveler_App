import Profile from '../models/profile'

function renderMatchesOverview (req: any, res: any) {
    if (req.session.userId) {
        Profile.find()
        .limit(4)
        .exec()
        .then()
        .catch()
    }
    const overviewData = [
        {
            _id: '1',
            firstName: 'Henk',
            fullName: 'Henk Smits',
            profileImages: [ '/visitorProfileImages/available-traveler.jpg', '/visitorProfileImages/available-traveler.jpg' ],
            age: 31,
            ownGender: 'Male',
            description: 'Henk loves to travel, just like you, otherwise you wouldn\'t be here, right?',
            favouriteHolidayDestination: 'Dubai',
            likesToHike: 'Yes',
            favouriteOverallTravelTime: 3,
        },
        {
            _id: '2',
            firstName: 'Henry',
            fullName: 'Henry Smits',
            ownGender: 'Male',
            profileImages: [ '/visitorProfileImages/available-traveler.jpg', '/visitorProfileImages/available-traveler.jpg' ],
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
