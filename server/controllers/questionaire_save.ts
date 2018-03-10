function handleQuestionaireSave (req: any, res: any) {
    console.log(req.body)
    console.log(req.file)

    res.redirect('/matches_overview')
}

export default handleQuestionaireSave
