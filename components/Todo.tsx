import React from 'react'
import { TodoistTask } from 'todoist-rest-api';

export default class IndexPage extends React.Component<{
  task: TodoistTask,
}, {
  completed: boolean,
  contentUrl?: string,
}> {

  constructor(props: any) {
    super(props);
    // Don't call this.setState() here!
    const match = new RegExp(/([^\s]+) \((.+)\)$/g).exec(props.task.content);
    let contentUrl : string|undefined;
    if(match)
    {
      props.task.content = match[2];
      contentUrl = match[1];
    }

    this.state = { 
      completed: false,
      contentUrl
    };
  }

  async clicked(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if(ev.ctrlKey)
    {
      window.open(this.state.contentUrl ?? this.props.task.url)
    }
    else
    {
      this.setState({
        completed: !this.state.completed
      });

      const extra = this.state.completed ? "un" : "";
      var resp = await fetch(location.origin + "/api/" + extra + "complete?id=" + this.props.task.id, {
        method: "POST",
      });
      if (!resp.ok) {
        resp.json().then((obj) =>{
          throw new Error(resp.statusText + "\n" + obj.message);

        })
      }
    }
  }

  render() {
    return <div onClick={(ev) => this.clicked(ev)} className={"todoitem " + (this.state.completed ? "completed" : "")}>
      <span className="checkbox">{this.state.completed ? "☑" : "☐"}</span>
      <span className="todotext">{this.props.task.content}</span>
    </div>
  }
}