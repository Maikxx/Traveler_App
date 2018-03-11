function handleHttpError (res, code, title) {
    const error = {
        id: code,
        title: title,
    }
    res.render('error.ejs', {
        error: error,
    })
}

export default handleHttpError
