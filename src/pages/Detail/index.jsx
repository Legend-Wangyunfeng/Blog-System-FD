import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import {Link} from 'react-router-dom'
import { Comment, List, Avatar, Form, Button, Input } from 'antd';
import store from '../../redux/store'

const { TextArea } = Input

axios.defaults.withCredentials = true

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Add Comment
      </Button>
    </Form.Item>
  </>
);


export default class Detail extends Component {
  state = {
    topic: {},
    comments: [],
    success: false,
    myComment: '',
    submitting: false
  }
  getData = async () => {
    const {id} = this.props.location.state
    try{
      const res = await axios.get(`http://120.26.75.6:3002/topics/show?id=${id}`)
      if(res.data.err_code === 0){
        this.setState({
          topic: res.data.topic,
          comments: res.data.comments,
          success: true
        })
      }
      else if(res.data.err_code === 500){
        alert('网络异常')
        this.props.history.goBack()
      }
    }
    catch{
      alert('网络异常')
      this.props.history.goBack()
    }

  }
  handleSubmit = (e) => {
    if(!this.state.myComment){
      return
    }
    this.setState({
      submitting: true,
    })
    e.preventDefault()
    const {id} = this.props.location.state
    const user = store.getState()
    const {nickname} = user
    const body = {
      topicID: id,
      name: nickname,
      content: this.state.myComment
    }
    axios.post('http://120.26.75.6:3002/topic/comment', body)
    .then(async res => {
      this.setState({
        submitting: false,
      })
      if(res.data.err_code === 0) {
        this.setState({
          myComment: ''
        })
        
        await this.getData()
      }
      else if(res.data.err_code === 1){
        alert('please login')
      }
      else if(res.data.err_code === 500){
        alert('服务器繁忙，请稍后重试')
      }
    })
  }
  handleContentChange =(e) => {
    this.setState({
      myComment: e.target.value
    })
  }
  componentDidMount() {
    // const user = store.getState()
    // this.setState({
    //   user
    // })
    this.getData()
  }
  render() {
    const {topic, comments, success, myComment, submitting} = this.state
    return (
      <section className="container">
        <div className="row">
          <div className="col-md-9">
            <article className="markdown-body">
              <h1 id="_1"><a name="user-content-_1" href="#_1" className="headeranchor-link" aria-hidden="true"><span className="headeranchor"></span></a>{ topic.title }</h1>
              <p>• 作者 <Link to={{pathname:'/index/information', state: {nickname:topic.name}}}>{ topic.name }</Link> • 发布于 { success && moment(topic.create_time).format('YYYY-MM-DD HH:mm:ss') } • 来自 { topic.area }</p>
              <div className="content">{ topic.content }</div>
            </article>
            <hr />
            {/* {comments.map(comment => {
              return (
                <div className="panel panel-default" key={comment._id}>
                  <div className="panel-heading">
                    <span>{comment.name }</span> 评论于&nbsp;
                    <span>{moment(comment.create_time).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </div>
                  <div className="panel-body">
                    {comment.content}
                  </div>
                </div>
              )
            })} */}
            <List
              className="comment-list"
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={item => (
                <li>
                  <Comment
                    author={<Link to={{pathname:'/index/information', state: {nickname:item.name}}}>{item.name}</Link>}
                    content={item.content}
                    datetime={moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')}
                  />
                </li>
              )}
            />
            <hr/>
            {/* <form id="comment_form" onSubmit={this.handleSubmit}>
              <input type="text" name='topicID' hidden value={ topic._id }/> 
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">添加回复</label>
                <textarea className="form-control" name="content" cols="10" rows="10" value={myComment} onChange={this.handleContentChange}></textarea>
              </div>
              <button type="submit" className="btn btn-success">回复</button>
            </form> */}
            <Comment
              avatar={
                <Avatar
                  src={topic.avatar}
                  alt={topic.name}
                />
              }
              content={
                <Editor
                  onChange={this.handleContentChange}
                  onSubmit={this.handleSubmit}
                  submitting={submitting}
                  value={myComment}
                />
              }
            />
          </div>
        </div>
      </section>
    )
  }
}

