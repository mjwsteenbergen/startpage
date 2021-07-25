import { NextApiRequest, NextApiResponse } from 'next'
import todoist, { TodoistLabel, TodoistTask } from 'todoist-rest-api';

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

        res.status(200).json((await parseItems(td, items)).sort((a, b) => (a.project_id*4 - a.priority) - (b.project_id *4 - b.priority)));
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export async function parseItems(td: any, items: TodoistTask[]): Promise<TodoistTaskE[]> {
    var labels: { [name: number]: TodoistLabel } = {};

    var getLabel = async (id: number) => {
        return labels[id] ?? await td.v1.label.find(id);
    }

    var colorIndexToString = (id: number) => {
        switch (id) {
            case 30:
                return "#b8256f";
            case 40:
                return "#96c3eb";
            case 31:
                return "#db4035";
            case 41:
                return "#4073ff";
            case 32:
                return "#ff9933";
            case 42:
                return "#884dff";
            case 33:
                return "#fad000";
            case 43:
                return "#af38eb";
            case 34:
                return "#afb83b";
            case 44:
                return "#eb96eb";
            case 35:
                return "#7ecc49";
            case 45:
                return "#e05194";
            case 36:
                return "#299438";
            case 46:
                return "#ff8d85";
            case 37:
                return "#6accbc";
            case 47:
                return "#808080";
            case 38:
                return "#158fad";
            case 48:
                return "#b8b8b8";
            case 39:
                return "#14aaf5";
            case 49:
                return "#ccac93";
            default:
                throw new Error("Invalid code");
        }
    }

    var findColor = async (task: TodoistTask) => {
        let color = "black";
        switch (task.priority) {
            case 1:
                color = "inherit";
                break;
            case 2:
                color = "#246fe0";
                break;
            case 3:
                color = "#eb8909";
                break;
            case 4:
                color = "#d1453b";
                break;
        };

        if (task.label_ids.length > 0) {
            const label = await getLabel(task.label_ids[0]);
            console.log(task.content, task.label_ids, label);
            color = colorIndexToString(label["color"] as number) ?? "rgb(20, 170, 245)";
        }

        let resTask = (task as TodoistTaskE);

        resTask.color = color;
        return resTask;
    }

    return Promise.all(items.map(async i => await findColor(i)));
}

export default handler;

export interface TodoistTaskE extends TodoistTask {

    color: string;

}
