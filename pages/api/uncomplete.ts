import { NextApiRequest, NextApiResponse } from 'next'
import todoist from 'todoist-rest-api';

const handler =async (_req: NextApiRequest, res: NextApiResponse) => {

    try {
        const token = _req.cookies["token"];
        if (token == undefined) {
            throw new Error("please provide a token")
        }

        let td = todoist(token || "");
        await td.v1.task.reopen(Number.parseInt(_req.query["id"] as string));

        res.status(200).json({});
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler