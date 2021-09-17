import React, { Component } from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Main from './pages/Main'

// APP组件包含登录、注册、主页三个子组件

export default class App extends Component {

  state = {user:{}}

  render() {
    return (
      <div>
        <Switch>
          <Route path="/index" component={Main}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/register" component={Register}></Route>
          <Redirect to="/index"></Redirect>
        </Switch>
      </div>
    )
  }
}

