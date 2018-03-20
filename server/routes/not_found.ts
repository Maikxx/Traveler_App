import handleHttpError from '../utils/handle_error'

function renderNotFound (error: any, req: any, res: any, next: any) {
    if (error) {
        handleHttpError(req, res, 404, 'Not Found', '/')
    } else {
        next()
    }
}

export default renderNotFound
