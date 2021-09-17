import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import PubSub from 'pubsub-js'
import './index.css'
import store from '../../redux/store'

axios.defaults.withCredentials = true
export default class Login extends Component {
  state = {
    email: '',
    password: ''
  }
  handleSubmit = (e) => {
    const _this = this
    const {email, password} = this.state
    e.preventDefault()
    const body = {
      email,
      password
    }
    axios.post('http://120.26.75.6:3001/login', body)
    .then(res => {
      if(res.data.err_code === 0){
        // PubSub.publish('user',{user:res.data.user})
        store.dispatch({type:'login',data:res.data.user})
        _this.props.history.push('/index')
      }
      else if(res.data.err_code === 1){
        alert('邮箱或密码错误')
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

  handlePasswordChange =(e) => {
    this.setState({
      password: e.target.value
    })
  }
  render() {
    const {email, password} = this.state
    return (
      <div className="main">
        <div className="header">
          <Link to="/index">
            <img src="/img/loginPic.jpg" alt="what" width="340px"/>
          </Link>
          <h1>用户登录</h1>
        </div>
        <form id="login_form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="">邮箱</label>
            <input type="email" className="form-control" id="" name="email" placeholder="Email" autoFocus value={email} onChange={this.handleEmailChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="">密码</label>
            <input type="password" className="form-control" id="" name="password" placeholder="Password" value={password} onChange={this.handlePasswordChange}/>
          </div>
          <div className="checkbox">
              <label>
                <input type="checkbox"/>记住我
              </label>
            </div>
            <button type="submit" className="btn btn-success btn-block">登录</button>
        </form>
        <div className="message">
          <p>没有账号? <Link to="/register">点击创建</Link>.</p>
        </div>
      </div>
    )
  }
}


