import React from 'react'
import { TodoistTask } from 'todoist-rest-api';
import { TodoistBackend } from '../pages';

export default class IndexPage extends React.Component<{
  task: TodoistTask,
}, {
  completed: boolean,
  contentUrl?: string,
}> {

  constructor(props: any) {
    super(props);
    // Don't call this.setState() here!
    

    this.state = { 
      completed: false,
      contentUrl: undefined
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
      TodoistBackend.Call("/api/" + extra + "complete?id=" + this.props.task.id);
    }
  }

  componentDidUpdate() {
    const match = new RegExp(/([^\s]+) \((.+)\)$/g).exec(this.props.task.content);
    if (match && this.state.contentUrl != match[1]) {
      this.setState({
        contentUrl: match[1]
      });
    }
  }

  render() {
    let text: string|JSX.Element = this.props.task.content;

    const match = new RegExp(/([^\s]+) \((.+)\)$/g).exec(this.props.task.content);
    if (match) {
      text = match[2];
    }

    return <div onClick={(ev) => this.clicked(ev)} className={"todoitem " + (this.state.completed ? "completed" : "")}>
      <span className="checkbox">{this.state.completed ? "☑" : "☐"}</span>
      <span className="todotext">{text}</span>
    </div>
  }
}