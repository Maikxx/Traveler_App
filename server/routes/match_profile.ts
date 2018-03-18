function renderMatchProfile (req: any, res: any) {
    const profileData = {
        profileId: 1,
        firstName: 'Henk',
        fullName: 'Henk Smits',
        birthDate: '1980/01/01',
        age: 31,
        profileImages: [ '/img/visitorProfileImages/1.1.jpg', '/img/visitorProfileImages/1.2.jpg' ],
        description: 'Henk loves to travel, just like you, otherwise you wouldn\'t be here, right?',
        hasTraveledTo: [ 'Amsterdam', 'Berlin' ],
        favouriteHolidayDestination: 'Dubai',
        favouriteHolidayTypes: [ 'Backpacking', 'Family' ],
        plansHolidaysAhead: 'Sometimes',
        likesToHike: 'Yes',
        prefersInterContinental: 'Yes',
        wantsToVisitSoon: [ 'Dubai', 'Paris' ],
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
    }

    res.render('match_profile.ejs', { profileData })
}

export default renderMatchProfile
