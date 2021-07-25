import React from 'react';
import todoist from 'todoist-rest-api';
import Layout from '../../components/Layout';
import Todo from '../../components/Todo';
import { parseItems } from '../api/items';
import { TodoistTaskE } from '../api/items';
import { GetServerSideProps } from 'next';

type iBS = {
    name?: string | null,
    order: number,
    items: TodoistTaskE[]
};

const ProjectPage = ({ itemsBySections, project_url, project_name }: { itemsBySections: iBS[], project_url: string, project_name: string }) => {
    

    let bgImage = "";
    if (process.browser) {
        bgImage = itemsBySections.length == 0 ? `url(https://source.unsplash.com/${window.screen.width}x${window.screen.height}/daily/)` : "";
    }
    return <Layout title={project_name} description="All the items on the todo list">
        <div className="entirepage" style={{
            backgroundImage: bgImage
        }}>
            <div className="todo-holder">
                {itemsBySections.sort(i => i.order).filter(section => section.items.length > 0).map(section => 
                    <div>
                        <h1>{section.name}</h1>
                        {
                            section.items.sort((i, j) => (i.order + i.section_id) - (j.order + j.section_id)).map(i =>
                                <Todo key={i?.id} task={i} />
                            )
                        }
                    </div>
                )}
            </div>
        </div>
        <a className="ext" href={project_url}>Open in todoist</a>
    </Layout>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let td = todoist(process.env.TODOIST_TOKEN || "");

    const id = context.params?.id     || "";
    const name = context.params?.name || "";

    

    const projectId = Number.parseInt(id?.toString() || "0");

    let project = await td.v1.project.find(projectId);
    if (typeof (name) == "string") {
        if (project.name.toLowerCase() !== name.toLowerCase()) {
            throw new Error();
        }
    }
    else {
        throw new Error();
    }

    let tItems = await td.v1.task.findAll({
        project_id: projectId
    });

    let sections = await td.v1.section.findAll({
        project_id: projectId
    });

    let items = await parseItems(td, tItems);

    var itemsBySections : iBS[] = sections.map(i => {
        return {
            name: i.name,
            order: i.order,
            items: items.filter(j => j.section_id == i.id)
        }
    });

    itemsBySections.splice(0, 0, {
        name: null,
        order: -1,
        items: items.filter(i => i.section_id === 0)
    });

    console.log(project);

    return {
        props: {
            itemsBySections,
            project_url: project.url,
            project_name: project.name
        }
    }
}

export default ProjectPage;