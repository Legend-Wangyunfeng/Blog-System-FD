import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import "./index.css";
import { Link } from "react-router-dom";
import { Button } from "antd";

export default class Information extends Component {
  state = {
    email: "",
    nickname: "",
    avatar: "",
    gender: -1,
    birthday: "",
    bio: "",
    preNickname: "",
    topics: [],
    newTopics: [],
  };

  componentWillMount() {
    const { nickname } = this.props.location.state;

    if (nickname === "") {
      const { email, nickname, avatar, gender, bio, birthday } =
        this.props.location.state;
      this.setState({
        email,
        preNickname: nickname,
        nickname: nickname,
        avatar,
        gender,
        bio,
        birthday,
      });
    } else {
      axios
        .get(`http://120.26.75.6:3001/user/?nickname=${nickname}`)
        .then((res) => {
          if (res.err_code === 500) {
            alert("服务器错误");
          } else {
            this.setState({
              email: res.data.userInfo.email,
              preNickname: res.data.userInfo.nickname,
              nickname: res.data.userInfo.nickname,
              avatar: res.data.userInfo.avatar,
              gender: res.data.userInfo.gender,
              bio: res.data.userInfo.bio,
              birthday: res.data.userInfo.birthday,
            });
          }
        });
    }
    //获取后台的发帖
    axios.get(`http://120.26.75.6:3001/topic/user/?nickname=${nickname}`).then((res) => {
      if(res.data.err_code === 0){
        this.setState({
          topics: res.data.topics,
        });
      }
      else{
        alert('网络错误')
      }
      
      // console.log("获取后台的发帖");
      // console.log(res.data.topic);
      // console.log(this.topics);
      // console.log(this.preNickname);
    })
  }

  //模仿List中，通过点击按钮获取该nickname的topic
  handleClick = (e) => {
    let { topics, nickname } = this.state;
    // console.log("点击事件中的Nickname" );
    // console.log(nickname);//可以输出componentWillMount中从后台得到的nicknam
    // console.log(this.state.nickname);//输出为undefined
    // console.log("点击事件中的topic");
    // console.log(topics)
    // const tempTopics = topics.filter((item) => item.name === nickname);
    this.setState({ newTopics: topics });
  };

  displayAvatar = () => {
    function getInputURL(file) {
      var url = null;
      if (window.createObjcectURL !== undefined) {
        url = window.createObjcectURL(file);
      } else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    }
    return (t) => {
      const fileNode = this.fileNode;
      const Img = this.Img;
      Img.src = getInputURL(fileNode.files[0]);
      Img.width = 100;
      Img.height = 100;
    };
  };

  render() {
    const {
      nickname,
      email,
      avatar,
      birthday,
      bio,
      preNickname,
      gender,
      newTopics,
    } = this.state;

    console.log("render中结构赋值后的this.nickname:" + this.nickname);
    console.log("render中结构赋值后nickname:" + nickname);

    console.log("render" + nickname);
    let content;
    if (newTopics.length > 0) {
      content = (
        <ul className="media-list">
          {newTopics.map((topic) => {
            return (
              <li className="media" key={topic._id}>
                <div className="media-left">
                  <img
                    width="40"
                    height="40"
                    className="media-object"
                    src={topic.avatar}
                    alt="..."
                  />
                </div>
                <div className="media-body">
                  <h4 className="media-heading">
                    <Link
                      to={{
                        pathname: "/index/topic",
                        state: { id: topic._id, nickname },
                      }}
                      style={{ fontSize: "16px", fontWeight: "700" }}
                    >
                      {topic.title}
                    </Link>
                  </h4>
                  <p>
                    {topic.lastCommenter !== "没有人" ? (
                      <Link
                        to={{
                          pathname: "/index/information",
                          state: { nickname: topic.lastCommenter },
                        }}
                      >
                        {topic.lastCommenter}
                      </Link>
                    ) : (
                      "没有人"
                    )}{" "}
                    回复了问题 • {topic.commentNum} 个回复 •{" "}
                    {moment(topic.last_modified_time).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <section className="container">
        <div className="col-md-5">
          {/* <input type="text" name="email" value={email} hidden readOnly/> */}
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">账号</label>
            <p className="form-control-static">{email}</p>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputNickname">昵称</label>
            <p>{preNickname}</p>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputNickname">头像</label>
            <div className="avatar">
              <img
                src={avatar}
                alt="默认头像"
                id="avatar"
                ref={(c) => (this.Img = c)}
                width={70}
                height={60}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">介绍</label>
            <p>{bio}</p>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">性别</label>
            <p>
              {gender === "1"
                ? "男"
                : gender === "0"
                ? "女"
                : gender === "-1"
                ? "保密"
                : ""}
            </p>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">生日</label>
            <p>{moment(birthday).format("YYYY-MM-DD")}</p>
          </div>

          <div>
            <Button type="primary" onClick={this.handleClick}>
              查看发帖列表
            </Button>
          </div>
          <br />
          {content}
        </div>
      </section>
    );
  }
}
