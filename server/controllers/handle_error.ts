function handleHttpError (res, code, title) {
    const error = {
        id: code,
        title: title,
    }
    res.render('error.ejs', Object.assign({}, error))
}

export default handleHttpError
