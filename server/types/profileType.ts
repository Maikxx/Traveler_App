// TypeScript interface for profiles, which is almost a 1-1 resemblance from the Mongoose schema.

export interface ProfileType {
    _id: string
    email?: string
    password?: string
    fullName?: string
    firstName?: string
    ownGender?: 'Male' | 'Female'
    birthdate?: Date
    age?: number
    profileImages?: [ string ]
    description?: string
    hasTraveledTo?: [ string ]
    favouriteHolidayDestination?: string
    favouriteHolidayTypes?: [ 'Roundtrip' | 'Family' | 'Bike' | 'Hike' | 'Backpacking' | 'Beach' | 'Winter' ]
    plansHolidaysAhead?: 'Often' | 'Sometimes' | 'No'
    likesToHike?: 'Yes' | 'Sometimes' | 'No'
    prefersInterContinental?: 'Yes' | 'Sometimes' | 'No'
    wantsToVisitSoon?: [ string ]
    hasVisitedThisMuchDestinations?: number
    favouriteOverallTravelTime?: number
    wantsToTravelQuickly?: 'Yes' | 'No'
    wantsToMarry?: 'Yes' | 'Maybe' | 'No'
    foremostRelationshipMotivation?: string
    wantsToOrAlreadyHasChildren?: 'Yes I have them' | 'Yes I want them' | 'Maybe' | 'No'
    drinksAlcohol?: 'Yes often' | 'Yes sometimes' | 'No'
    smokes?: 'Yes often' | 'Yes sometimes' | 'No'
    likesToBeInNature?: 'Yes' | 'No'
    mostImportantInRelationShip?: string
    favouriteMusicGenre?: string
    yearlyEarns?: 'Less than 25K' | '25K-50K' | 'More than 50K'
    livesIn?: string
    jobTitle?: string
    lengthInCm?: number
    matchSettings?: {
        matchHasToLikeToBeInNature?: 'Yes' | 'No'
        maxMatchDistance?: number
        minSearchAge?: number
        maxSearchAge?: number
        lookingForGender?: 'Male' | 'Female'
    }
    chats?: [ string ]
    hasFinishedQuestionaire?: boolean
}
