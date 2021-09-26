import React, { Component } from 'react'
import axios from 'axios'
import PubSub from 'pubsub-js'
import store from '../../redux/store'

axios.defaults.withCredentials = true

export default class index extends Component {
  state = {area:'分享', title: '', content: ''}
  handleSubmit = (e) => {
    e.preventDefault()
    const user = store.getState()
    const {nickname,avatar} = user
    const body = {
      ...this.state,
      name: nickname,
      avatar
    }
    axios.post('http://127.0.0.1:3002/topics/new', body)
    .then(res => {
      if(res.data.err_code === 0) {
        this.props.history.push('/index')
      }
      else if(res.data.err_code === 500){
        alert('服务器繁忙，请稍后重试')
      }
    })
  }
  handleAreaChange = (e) => {
    this.setState({
      area: e.target.value
    })
  }
  handleTitleChange = (e) => {
    this.setState({
      title: e.target.value
    })
  }
  handleContentChange =(e) => {
    this.setState({
      content: e.target.value
    })
  }
  componentDidMount () {
    // 在这里获取用户消息不太合理，不过也能获取到，来不及改了
    // this.token = PubSub.subscribe('user',(_,stateObj)=>{
		// 	this.setState({
    //     nickname: stateObj.user.nickname,
    //     avatar: stateObj.user.avatar
    //   })
		// })
    // const user = store.getState()
    // this.setState({
    //   user
    // })
  }
  render() {
    const {area, title, content} = this.state
    return (
      <section className="container">
        <div className="row">
          <div className="col-md-5">
            <form id="topic_form" onSubmit={this.handleSubmit}>
              {/* <input type="text" name="name"  value="{{ user.nickname }}" hidden/>
              <input type="text" name="avatar"  value="{{ user.avatar }}" hidden/> */}
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">选择板块</label>
                <select className="form-control" name="area" value={area} onChange={this.handleAreaChange}> 
                  <option value="分享">分享</option>
                  <option value="问答">问答</option>
                  <option value="招聘">招聘</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">标题</label>
                <input type="text" className="form-control" id="exampleInputEmail1" name="title" value={title} onChange={this.handleTitleChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">内容</label>
                <textarea className="form-control" rows="8" name="content" value={content} onChange={this.handleContentChange}></textarea>
              </div>
              <button type="submit" className="btn btn-default">Submit</button>
            </form>
          </div>
        </div>
      </section>
    )
  }
}
