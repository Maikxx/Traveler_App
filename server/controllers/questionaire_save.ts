import handleHTTPError from './handle_error'

function handleQuestionaireSave (req: any, res: any) {
    const questionaireData = {}
    const {
        where_have_you_been,
        favorite_holiday_destination,
        holiday_formats,
        plans_ahead,
        likes_to_hike,
        likes_trans_atlantic,
        where_do_you_want_to_go,
        amount_of_trips_made,
        favorite_travel_time,
        wants_to_marry,
        relationship_reason,
        children,
        drinks_alcohol,
        smokes,
        likes_nature,
        music_genre,
        yearly_earns,
        birthdate,
        hometown,
        job_title,
        length: personalLength,
        profile_description,
        match_likes_nature,
        most_important_in_relationship,
        max_match_distance,
        min_search_age,
        max_search_age,
        important_match_has_made_trips,
        wants_to_travel_fast,
    } = req.body

    if (
        !where_have_you_been.length ||
        !favorite_holiday_destination.length ||
        !holiday_formats.length ||
        !plans_ahead.length ||
        !likes_to_hike.length ||
        !likes_trans_atlantic.length ||
        !where_do_you_want_to_go.length ||
        !amount_of_trips_made.length ||
        !favorite_travel_time.length ||
        !wants_to_marry.length ||
        !relationship_reason.length ||
        !children.length ||
        !drinks_alcohol.length ||
        !smokes.length ||
        !likes_nature.length ||
        !music_genre.length ||
        !yearly_earns.length ||
        !birthdate.length ||
        !hometown.length ||
        !job_title.length ||
        !personalLength.length ||
        !profile_description.length ||
        !match_likes_nature.length ||
        !most_important_in_relationship.length ||
        !max_match_distance.length ||
        !min_search_age.length ||
        !max_search_age.length ||
        !important_match_has_made_trips.length ||
        !wants_to_travel_fast.length
    ) {
        console.error('Not all fields are filled in')
        handleHTTPError(res, 422, 'Unprocessable Entity')
        return
    } else {
        req.body = JSON.parse(JSON.stringify(req.body))

        for (const property in req.body) {
            if (req.body.hasOwnProperty(property)) {
                questionaireData[property] = req.body[property]
            }
        }

        console.log(questionaireData)
    }

    res.redirect('/matches_overview')
}

export default handleQuestionaireSave
