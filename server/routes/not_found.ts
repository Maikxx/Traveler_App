import handleHttpError from '../utils/handleError'

function renderNotFound (error: any, req: any, res: any, next: any) {
    if (error) {
        handleHttpError(req, res, 404, 'Not Found', '/')
    }
}

export default renderNotFound
