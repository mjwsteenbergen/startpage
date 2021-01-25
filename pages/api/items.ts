import { NextApiRequest, NextApiResponse } from 'next'
import todoist from 'todoist-rest-api';

const handler =async (_req: NextApiRequest, res: NextApiResponse) => {

    try {
        const token = _req.query["token"] as string;
        if (token == undefined) {
            throw new Error("please provide a token")
        }

        const filter = _req.query["filter"] as string;
        if (filter == undefined) {
            throw new Error("please provide a token")
        }

        let td = todoist(token || "");

        let items = await td.v1.task.findAll({
            filter
        });

        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler