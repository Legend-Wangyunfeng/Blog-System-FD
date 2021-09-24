import React, { Component } from 'react'
import { Layout, Menu, Input, Button, Dropdown } from 'antd'
import { Switch, Route, Redirect} from 'react-router-dom'
import axios from 'axios'
import PubSub from 'pubsub-js'
import 'antd/dist/antd.css'
import './index.css'
import store from '../../redux/store'
import List from '../List'
import Publish from '../Publish'
import Detail from '../Detail'
import Settings from '../Settings'
import Information from '../Info'

const { Header, Content, Footer } = Layout
const { Search } = Input

axios.defaults.withCredentials = true


// Main组件存储用户信息，从登录或注册组件获得，用react-router的state参数层层传递
// 子组件包含列表展示、发布、详情（评论）、设置
// 不同子组件接收state参数我可能写在了不同类型的生命周期钩子里，因为有些组件在某个钩子中能接收到，但是另一些接收不到，不知道为什么

export default class index extends Component {
  state = {user:{}}

  // 搜索功能回调
  onSearch = (value, event) => {
    this.props.history.push('/index/display',{name: this.state.user.nickname, title: value})
  }

  login = () => {
    this.props.history.push('/login')
  }

  logout = () => {
    axios.get('http://127.0.0.1:3002/logout')
    .finally(res => {
      // PubSub.publish('user',{user:{}})
      store.dispatch({type:'logout',data:{}})
      this.setState({
        user: {}
      })
    })
  }

  register = () => {
    this.props.history.push('/register')
  }

  newTopic = () => {
    // const {nickname, avatar} = this.state.user
    // console.log(this.state.user);
    // this.props.history.push(`/index/publish`, {nickname, avatar})
    this.props.history.push(`/index/publish`)
  }

  updateInfo = () => {
    const {email, nickname, avatar, bio, gender, birthday} = this.state.user
    this.props.history.push('/index/settings', {email, nickname, avatar, bio, gender, birthday})
  }

  personInfo = () => {
    const {email, nickname, avatar, bio, gender, birthday} = this.state.user
    this.props.history.push('/index/information', {email, nickname, avatar, bio, gender, birthday})
  }

  toList = () => {
    this.props.history.push('/index/display')
  }

  // 从登录和注册页获取信息
  componentDidMount () {
    // this.token = PubSub.subscribe('user',(_,stateObj)=>{
		// 	this.setState({
    //     user: stateObj.user
    //   })
    //   this.props.history.push('/index/display',{name: stateObj.user.nickname})
		// })

    const user = store.getState()
    this.setState({
      user
    })
    this.props.history.push('/index/display')
  }

  // componentWillUnmount (){
	// 	PubSub.unsubscribe(this.token)
	// }
  render() {
    let nav
    let {nickname, avatar} = this.state.user || {}
    const menu = (
      <Menu style={{padding:'0'}}>
        <Menu.Item key="0" style={{padding:'0'}}>
          <Button onClick={this.personInfo} type="text" style={{width:'100%', height:'100%', textAlign:'left', padding:'12px'}}>
            当前登录用户：{nickname}
          </Button>
        </Menu.Item >
        <Menu.Item key="1" style={{padding:'0'}}>
          <Button onClick={this.updateInfo} type="text" style={{width:'100%', height:'100%', textAlign:'left', padding:'12px'}}>
            设置
          </Button>
        </Menu.Item>
        <Menu.Item key="2" style={{padding:'0'}}>
          <Button onClick={this.logout} type="text" style={{width:'100%', height:'100%', textAlign:'left', padding:'12px'}}>
            退出
          </Button>
        </Menu.Item>
      </Menu>
    );
    // 未登录渲染登录和注册
    if(!nickname){
      nav = (
        <div>
          <Button type="primary" onClick={this.toList}>回到首页</Button>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.login}>登录</Button>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="success" onClick={this.register} style={{'backgroundColor': '#5CB85C', 'color': 'white'}}>注册</Button>
        </div>
      )
    }
    // 已经登录渲染头像和发起
    else{
      nav = (
        <div>
          <Button type="primary" onClick={this.toList}>回到首页</Button>&nbsp;&nbsp;&nbsp;&nbsp;
          <Dropdown overlay={menu} placement="bottomCenter">
            <img src={avatar} alt="" width={40}/>
          </Dropdown>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.newTopic}>发起</Button>
        </div>
      )
    }
    
    // 子组件包含列表展示、发布、详情（评论）、设置
    return (
      <Layout className="layout">
        <Header>         
          <div className="logo" />
            <div className="my-header">
              <Search placeholder="请输入你要查找的内容..." allowClear onSearch={this.onSearch} style={{ width: 250 }} />
              
              {nav} 
            </div>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
          <Switch>
            <Route path="/index/display" component={List}></Route>
            <Route path="/index/publish" component={Publish}></Route>
            <Route path="/index/topic" component={Detail}></Route>
            <Route path="/index/settings" component={Settings}></Route>
            <Route path="/index/information" component={Information}></Route>
            <Redirect to="/index/display"></Redirect>
          </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    )
  }
}
