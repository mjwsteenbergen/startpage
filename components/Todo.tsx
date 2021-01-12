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
    console.log(props.task.content);
    // Don't call this.setState() here!
    const match = new RegExp(/([^\s]+) \((.+)\)$/g).exec(props.task.content);
    console.log(match);
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

  clicked(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if(ev.ctrlKey)
    {
      window.open(this.state.contentUrl ?? this.props.task.url)
    }
    else
    {
      this.setState({
        completed: !this.state.completed
      })
    }
  }

  render() {
    return <div onClick={(ev) => this.clicked(ev)} className={"todoitem " + (this.state.completed ? "completed" : "")}>
      <span className="checkbox">{this.state.completed ? "☑" : "☐"}</span>
      <span className="todotext">{this.props.task.content}</span>
    </div>
  }
}