import axios from 'axios'
import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import PubSub from 'pubsub-js'
import store from '../../redux/store'
import './index.css'

axios.defaults.withCredentials = true

export default class index extends Component {

  state = {
    email: '',
    nickname: '',
    password: ''
  }
  handleSubmit = (e) => {
    const _this = this
    const {email, nickname, password} = this.state
    e.preventDefault()
    const body = {
      email,
      nickname,
      password
    }
    axios.post('http://120.26.75.6:3002/register', body)
    .then(res => {
      if(res.data.err_code === 0){
        // PubSub.publish('user',{user:res.data.user})
        store.dispatch({type:'login',data:res.data.user})
        _this.props.history.push('/index')
      }
      else if(res.data.err_code === 1){
        alert('邮箱已存在！')
      }
      else if(res.data.err_code === 2){
        alert('昵称已存在！')
      }
      else if(res.data.err_code === 500){
        alert('服务器忙，请稍后重试！')
      }
    })
  }
  handleEmailChange =(e) => {
    this.setState({
      email: e.target.value
    })
  }
  handelNicknameChange =(e) => {
    this.setState({
      nickname: e.target.value
    })
  }
  handlePasswordChange =(e) => {
    this.setState({
      password: e.target.value
    })
  }
  render() {
    const {email, nickname, password} = this.state
    return (
      <div className="main">
      <div className="header">
        <Link to="/index">
          <img src="/img/registerPic.jpg" alt="" width="340px"/>
        </Link>
        <h1>用户注册</h1>
      </div>
      <form id="register_form" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">邮箱</label>
          <input type="email" className="form-control" id="email" name="email" placeholder="Email" autoFocus value={email} onChange={this.handleEmailChange}/>
        </div>
        <div className="form-group">
          <label htmlFor="nickname">昵称</label>
          <input type="text" className="form-control" id="nickname" name="nickname" placeholder="Nickname" value={nickname} onChange={this.handelNicknameChange}/>
        </div>
        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input type="password" className="form-control" id="password" name="password" placeholder="Password" value={password} onChange={this.handlePasswordChange}/>
        </div>
        <button type="submit" className="btn btn-success btn-block">注册</button>
      </form>
      <div className="message">
        <p>已有账号? <Link to="/login">点击登录</Link>.</p>
      </div>
    </div>
    )
  }
}

