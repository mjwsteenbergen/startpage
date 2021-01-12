import { GetStaticProps } from 'next'
import cookies from 'next-cookies'
import React from 'react'
import todoist, { TodoistTask } from 'todoist-rest-api'
import Layout from '../components/Layout'
import Todo from '../components/Todo'

type Props = {
  items: TodoistTask[],
}

export default class IndexPage extends React.Component<Props, {}> {

  render() {
    return <Layout title="startpage" description="Startpage">
      <div className="entirepage">
        <div className="todoholder">
          {
            this.props.items.map(i =>
              <Todo key={i?.id} task={i} />
            )
          }
        </div>
      </div>
    </Layout>
  }
}


export const getServerSideProps: GetStaticProps = async (context) => {
  const token = cookies(context as any).token;

  if(token == undefined)
  {
    console.error("please create a cookie with value 'token'");
    return {
      props: {
        items: []
      }
    };
  }

  let td = todoist(token || "");

  let items = await td.v1.task.findAll({
    filter: "@today | today"
  });

  console.log(items);

  return {
    props: { items },
  };
}
