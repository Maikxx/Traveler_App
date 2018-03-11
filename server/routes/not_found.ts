import handleHTTPError from '../controllers/handle_error'

function renderNotFound (req: any, res: any) {
    handleHTTPError(res, 404, 'Not Found')
}

export default renderNotFound
