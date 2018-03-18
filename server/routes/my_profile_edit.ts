function renderMyProfileEdit (req: any, res: any) {
    const profileData = {
        profileId: 1,
        firstName: 'Sandra',
        fullName: 'Sandra de Doorn',
        birthDate: '1980/01/01',
        age: 29,
        profileImages: [ 'visitorProfileImages/available-traveler.jpg', 'visitorProfileImages/available-traveler.jpg' ],
        description: 'Henk loves to travel, just like you, otherwise you wouldn\'t be here, right?',
        hasTraveledTo: [ 'Amsterdam', 'Berlin' ].join(', '),
        favouriteHolidayDestination: 'Dubai',
        favouriteHolidayTypes: [ 'Backpacking', 'Family' ],
        plansHolidaysAhead: 'Sometimes',
        likesToHike: 'Yes',
        prefersInterContinental: 'Yes',
        wantsToVisitSoon: [ 'Dubai', 'Paris' ].join(', '),
        hasVisitedThisMuchDestinations: 20,
        favouriteOverallTravelTime: 3,
        wantsToTravelQuickly: 'Yes',
        mostImportantInRelationShip: 'Trust',
        wantsToMarry: 'Yes',
        foremostRelationshipMotivation: 'Being able to travel the world with that someone',
        wantsToOrAlreadyHasChildren: 'Yes, I have them',
        drinksAlcohol: 'Yes, often',
        smokes: 'No',
        likesToBeInNature: 'Yes',
        favouriteMusicGenre: 'Hardstyle',
        yearlyEarns: 'More than 50K',
        livesIn: 'Rotterdam, the Netherlands',
        jobTitle: 'Architect',
        lengthInCm: 183,
        matchSettings: {
            matchHasToLikeToBeInNature: 'Yes',
            maxMatchDistance: 80,
            minSearchAge: 18,
            maxSearchAge: 23,
        },
    }

    res.render('my_profile_edit.ejs', { profileData })
}

export default renderMyProfileEdit
