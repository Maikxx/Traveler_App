import Profile from '../models/profile'
import handleHttpError from '../utils/handle_error'

function renderQuestionaire (req: any, res: any) {
    if (req.session.userId) {
        const _id = req.session.userId

        Profile.count({ _id }, (error, count) => {
            if (error) {
                console.error(error)
                handleHttpError(req, res, 500, 'Internal Server Error', '/')
            } else {
                if (count > 0) {
                    res.render('questionaire.ejs', { _id })
                } else {
                    console.error(error)
                    handleHttpError(req, res, 500, 'Internal Server Error', '/')
                }
            }
        })
    }
}

export default renderQuestionaire
