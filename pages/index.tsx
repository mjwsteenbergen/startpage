import React from 'react'
import { TodoistTask } from 'todoist-rest-api'
import Layout from '../components/Layout'
import Todo from '../components/Todo'


export default class IndexPage extends React.Component<{}, {
  items: TodoistTask[]
}> {

  constructor(props: any) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    if (process.browser) {
      TodoistBackend.GetItems((items) => {
        this.setState({
          items: items
        });
      })
    }
    this.forceUpdate();
  }

  render() {
    let bgImage = "";
    if (process.browser) {
      bgImage = this.state.items.length == 0 ? `url(https://source.unsplash.com/${window.screen.width}x${window.screen.height}/daily/)` : "";
    }
    return <Layout title="startpage" description="Startpage">
      <div className="entirepage" style={{
        backgroundImage: bgImage
      }}>
        <div className="todoholder">
          {
            this.state.items.map(i =>
              <Todo key={i?.id} task={i}/>
            )
          }
        </div>
      </div>
    </Layout>
  }
}

export class TodoistBackend {

  public static async Call<T>(endpoint:string): Promise<T>
  {
    let url = new URL(location.origin + endpoint);

    let token = localStorage.getItem("todoist-token");
    if(token == null)
    {
      throw new Error("Please add your token in localstorage");
    }

    url.searchParams.append("token", token);

    const resp = await fetch(url.toString());
    if (resp.ok) {
      return (await resp.json()) as unknown as T;
    } else {
      let obj = await resp.json();
      throw new Error(resp.statusText + "\n" + obj?.message);
    }
  }

  public static GetItems(func: (tasks: TodoistTask[])=>void) {
    let cacheItems = JSON.parse(localStorage.getItem("items-cache") || "[]") as TodoistTask[];
    
    func(cacheItems);

    this.Call<TodoistTask[]>("/api/items").then(i => {
      func(i);
      localStorage.setItem("items-cache", JSON.stringify(i));
    });
  }


}
