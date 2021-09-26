import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import {Menu, List, Avatar, Button, Skeleton} from 'antd'
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import './index.css'

axios.defaults.withCredentials = true

// topics存储所有topic，newTopics存储搜索命中的topic，搜索框为空则命中全部topics
const areaMap = {"share": "分享", "ask": "问答", "zhaopin": "招聘"}
export default class index extends Component {
  state = {
    initLoading: true,
    loading: false,
    topics: [], 
    newTopics: [], 
    current: 'total', 
    count: 0, 
    pageNum: 5,
    showAll: false
  }

  getData = callback => {
    const {count, pageNum} = this.state
    axios.get(`http://127.0.0.1:3002/?count=${count}&pageNum=${pageNum}`)
    .then(res => {
      callback(res)
      this.setState({count: count+1})
    })
  }

  handleClick = e => {
    let {topics} = this.state;
    this.setState({ current: e.key });
    if(e.key === "share"){
      const tempTopics = topics.filter((item) => item.area === "分享")
      this.setState({newTopics: tempTopics})
    }
    else if(e.key === "ask"){
      const tempTopics = topics.filter((item) => item.area === "问答")
      this.setState({newTopics: tempTopics})
    }
    else if(e.key === "zhaopin"){
      const tempTopics = topics.filter((item) => item.area === "招聘")
      this.setState({newTopics: tempTopics})
    }
    else if(e.key === "total"){
      const tempTopics = [...topics]
      this.setState({newTopics: tempTopics})
    }
  };

  componentDidMount() {
    this.getData(res => {
      this.setState({
        initLoading: false,
        topics: res.data.topic,
        newTopics: res.data.topic,
      })
    })
    // const {count, pageNum} = this.state
    // axios.get(`http://127.0.0.1:3002/?count=${count}&pageNum=${pageNum}`)
    // .then(res => {
    //   console.log(res.data);
    //   this.setState({
    //     topics: res.data.topic,
    //     newTopics: res.data.topic,
    //   })
    // })
  };


  componentWillReceiveProps(nextProps) {
    // const {name, title} = nextProps.location.state || { }
    const {title} = nextProps.location.state || { }
    let {topics} = this.state
    let newTopics
    if(title){
      newTopics = topics.filter((item) => {
        return item.title.indexOf(title) !== -1
      })
      
    }
    else {
      newTopics = [...topics]
    }
    this.setState({
      // name,
      title,
      newTopics,
      current: "total"
    })
    // axios.get(`http://127.0.0.1:3002/search/?topic=${title}`)
    // .then(res => {
    //   this.setState({
    //     topics: res.data.topic
    //   })
    // })
  }

  onLoadMore = () => {
    const {pageNum ,topics, newTopics, current} = this.state
    this.setState({
      loading: true,
      topics: topics.concat([...new Array(pageNum)].map(() => ({ loading: true, title: '' }))),
      newTopics: newTopics.concat([...new Array(pageNum)].map(() => ({ loading: true, title: '' }))),
    });
    this.getData(res => {
      if(res.data.topic.length === 0){
        this.setState({
          showAll: true
        })
      }
      const tmpTopics = res.data.topic
      const tmpNewTopics = current === 'total' ? tmpTopics : tmpTopics.filter(topic => topic.area === areaMap[current])
      this.setState(
        {
          newTopics: newTopics.concat(tmpNewTopics),
          topics: topics.concat(tmpTopics),
          loading: false,
        },
        () => {
          // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
          // In real scene, you can using public method of react-virtualized:
          // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
          window.dispatchEvent(new Event('resize'));
        },
      );
    });
  }
  render() {
    const {newTopics, current, initLoading, loading, showAll} = this.state
    const loadMore =
      !initLoading && !loading && !showAll? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button onClick={this.onLoadMore}>loading more</Button>
        </div>
      ) : null

    // topics.filter((item) => item.title === title)
    let content
    if(newTopics.length > 0){
      content = (
        <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={newTopics}
        renderItem={topic => (
          <List.Item>
            <Skeleton avatar title={false} loading={topic.loading} active>
              <List.Item.Meta
                avatar={
                  <Avatar src={topic.avatar} />
                }
                title={<Link to={{pathname:'/index/topic', state:{id:topic._id}}} >{topic.title}</Link>}
                description={<p>{topic.lastCommenter !== "没有人" ? <Link to={{pathname:'/index/information', state: {nickname:topic.lastCommenter}}}>{topic.lastCommenter}</Link> : "没有人"} 回复了问题 • {topic.commentNum } 个回复 • {moment(topic.last_modified_time).format('YYYY-MM-DD HH:mm:ss')}</p>}
              />
            </Skeleton>
          </List.Item>
        )}
      />
        // <ul className="media-list">
        //   {newTopics.map(topic => {
        //     return (
        //       <li className="media" key={topic._id}>
        //         <div className="media-left">
        //           <img width="40" height="40" className="media-object" src={topic.avatar} alt="..."/>
        //         </div>
        //         <div className="media-body">
        //           <h4 className="media-heading"><Link to={{pathname:'/index/topic', state:{id:topic._id, name}}} style={{fontSize: "16px", fontWeight: "700"}}>{topic.title}</Link></h4>
        //           <p>{topic.lastCommenter !== "没有人" ? <Link to={{pathname:'/index/information', state: {nickname:topic.lastCommenter}}}>{topic.lastCommenter}</Link> : "没有人"} 回复了问题 • {topic.commentNum } 个回复 • {moment(topic.last_modified_time).format('YYYY-MM-DD HH:mm:ss')}</p>
        //         </div>
                
        //       </li>
        //     )
        //   })}
        // </ul>
      )
    }
    else{
      content = <h2 className="no-result">结果为空</h2>
    }
    return (
      <section className="container">
        {/* 导航栏部分 */}
      <Menu onClick={this.handleClick} selectedKeys={[current]} style={{width: '90%'}} mode="horizontal">
        <Menu.Item key="total" icon={<BarsOutlined />}>
          所有内容
        </Menu.Item>
        <Menu.Item key="share" icon={<AppstoreOutlined />}>
          分享
        </Menu.Item>
        <Menu.Item key="ask" icon={<AppstoreOutlined />}>
          问答
        </Menu.Item>
        <Menu.Item key="zhaopin" icon={<AppstoreOutlined />}>
          招聘
        </Menu.Item>
      </Menu>
      <p></p>
        {content}

      </section>
    )
  }
}
