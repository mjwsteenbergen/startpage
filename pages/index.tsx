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
      ItemsStore.GetItems((items) => {
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

class ItemsStore {

  public static GetItems(func: (tasks: TodoistTask[])=>void) {
    let cacheItems = JSON.parse(localStorage.getItem("items-cache") || "[]") as TodoistTask[];
    
    func(cacheItems);

    fetch(location.origin + "/api/items").then(i => {
      if (i.ok) {
        return i.json();
      }
      throw new Error(i.statusText);
    }).then(i => {
      func(i);
      localStorage.setItem("items-cache", JSON.stringify(i));
    });

  }
}
