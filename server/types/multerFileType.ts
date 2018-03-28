// As seen on https://github.com/expressjs/multer/issues/343 by Blake Embrey

export interface MulterFile {
    key: string // Available using `S3`.
    path: string // Available using `DiskStorage`.
    mimetype: string
    originalname: string
    destination: string
    size: number
}
