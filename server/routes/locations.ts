import * as fs from 'fs'
import * as path from 'path'
import * as express from 'express'

// Route that handles API requests to the location data.

async function handleLocationRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
    await fs.readFile(path.join(__dirname, '../../locationData/world-cities.json'), async (error: NodeJS.ErrnoException, data: any) => {
        if (error) {
            res.status(500).json({
                error: error,
            })
        } else {
            if (data && data.length) {
                const parsedData = await JSON.parse(data)

                res.status(200).json({
                    data: parsedData,
                })
            } else {
                res.status(500).json({
                    error: 'No data found!',
                })
            }
        }
    })
}

export default handleLocationRequest
