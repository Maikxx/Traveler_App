function renderQuestionaire (req: any, res: any) {
    const { _id } = req.params

    res.render('questionaire.ejs', { _id })
}

export default renderQuestionaire
