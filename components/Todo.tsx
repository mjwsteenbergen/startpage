import React from 'react'
import { TodoistTaskE } from '../pages/api/items';
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm';


export default class IndexPage extends React.Component<{
  task: TodoistTaskE,
  onComplete?: (completed: boolean) => void
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
    if ((ev.target as any).nodeName === "A")
    {
      return;
    }

    if(ev.ctrlKey)
    {
      window.open(this.props.task.url)
    }
    else
    {
      this.setState({
        completed: !this.state.completed
      });

      this.props.onComplete?.apply(this, [this.state.completed ]);
    }
  }

  componentDidUpdate() {
    const match = new RegExp(/\[([^\]]+)\]\(([^\)]+)\)/g).exec(this.props.task.content);
    if (match && this.state.contentUrl != match[2]) {
      this.setState({
        contentUrl: match[2]
      });
    }
  }

  render() {
    return <div onClick={(ev) => this.clicked(ev)} className={"todoitem " + (this.state.completed ? "completed" : "")}>
      <span className="checkbox" style={{
        color: this.props.task.color
      }}>{this.state.completed ? "☑" : "☐"}</span>
      <span className="todo-text"><ReactMarkdown remarkPlugins={[gfm]}>{this.props.task.content as string}</ReactMarkdown></span>
      <span className="todo-description"><ReactMarkdown remarkPlugins={[gfm]}>{this.props.task.description as string}</ReactMarkdown></span>
    </div>
  }
}