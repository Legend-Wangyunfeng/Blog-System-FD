import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {Layout, Menu} from 'antd';

// import './index.css'

const { Header, Content, Footer } = Layout;
export default class index extends Component {
  render() {
    let nav
    if(this.props.user.nickname){
      const {avatar, nickname} = this.props.user
      const menu = (
        <Menu>
          <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
              1st menu item
            </a>
          </Menu.Item>
          <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
              2nd menu item
            </a>
          </Menu.Item>
          <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
              3rd menu item
            </a>
          </Menu.Item>
        </Menu>
      );
      nav = (
        <div className="nav navbar-nav navbar-right">
          {/* <a className="btn btn-default navbar-btn" href="/topics/new">发起</a> */}
          {/* <div className="dropdown" >
            <a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" href='#'>
              <img width="50" height="50" src={avatar} alt=""/> 
              <span className="caret"></span>
            </a>
            <ul className="dropdown-menu">
              <li className="dropdown-current-user">
                当前登录用户: {nickname}
              </li>
              <li role="separator" className="divider"></li>
              <li><a href="/settings/profile">设置</a></li>
              <li><a href="/logout">退出</a></li>
            </ul>
          </div> */}
        </div>
      )
    }
    else{
      nav = (
        <div className="nav navbar-nav navbar-right">
          <Link className="btn btn-primary navbar-btn" to="/login">登录</Link>&nbsp;
          <Link className="btn btn-success navbar-btn" to="/register">注册</Link>
        </div>
      )
    }
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            {new Array(15).fill(null).map((_, index) => {
              const key = index + 1;
              return <Menu.Item key={key}>{`nav ${key}`}</Menu.Item>;
            })}
          </Menu>
        </Header>
      </Layout>
    )
  }
}

