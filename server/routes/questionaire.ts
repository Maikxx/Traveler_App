import Profile from '../models/profile'
import handleHTTPError from '../utils/handle_error'

function renderQuestionaire (req: any, res: any) {
    const { _id } = req.params

    Profile.count({ _id }, (error, count) => {
        if (error) {
            console.error(error)
            handleHTTPError(res, 500, 'Internal Server Error')
        } else {
            if (count > 0) {
                res.render('questionaire.ejs', { _id })
            } else {
                console.error(error)
                handleHTTPError(res, 500, 'Internal Server Error')
            }
        }
    })

}

export default renderQuestionaire
