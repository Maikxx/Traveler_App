import handleHttpError from '../utils/handle_error'

function renderNotFound (req: any, res: any) {
    handleHttpError(res, 404, 'Not Found')
}

export default renderNotFound
