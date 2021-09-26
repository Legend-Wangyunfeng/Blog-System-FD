import React, { Component } from 'react'
import axios from 'axios'
import PubSub from 'pubsub-js'
import store from '../../redux/store'
// import Profile from './Profile'
export default class index extends Component {

  state = {
    email: '',
    nickname: '',
    avatar: '',
    gender: -1,
    birthday: '',
    bio: '',
    preNickname: ''
  }

  // componentWillMount () {
  //   const {email, nickname, avatar, gender, bio} = this.props.location.state
  //   this.setState({
  //     email,
  //     preNickname: nickname,
  //     nickname: nickname,
  //     avatar,
  //     gender,
  //     bio,
  //   })
  // }

  componentDidMount () {
    const user = store.getState()
    const {email, nickname, avatar, gender, bio} = user
    this.setState({
      email,
      preNickname: nickname,
      nickname: nickname,
      avatar,
      gender,
      bio,
    })
  }
  handleNicknameChange = (e) => {
    this.setState({
      nickname: e.target.value
    })
  }
  handleBioChange = (e) => {
    this.setState({
      bio: e.target.value
    })
  }
  handleGenderChange = (e) => {
    this.setState({
      gender: Number(e.target.value)
    })
  }
  handleBirthdayChange = (e) => {
    this.setState({
      birthday: e.target.value
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://120.26.75.6:3002/settings/profile', this.state)
    .then(res => {
      if(res.data.err_code === 0 || 1) {
        PubSub.publish('user',{user:{...this.state}})
        store.dispatch({type:'login',data:{...this.state}})
        this.props.history.push('/index')
      }
      // else if(res.data.err_code === 1){
      //   alert('昵称重复')
      // }
      else if(res.data.err_code === 500){
        alert('服务器繁忙，请稍后重试')
      }
    })
  }
  displayAvatar = () => {
    function getInputURL(file) {
      var url = null;
      if(window.createObjcectURL !== undefined) {
        url = window.createObjcectURL(file)
      } else if(window.URL !== undefined) {
        url = window.URL.createObjectURL(file)
      } else if(window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file)
      }
    return url
    }
    return (t) => {
      const fileNode = this.fileNode
      const Img = this.Img
      Img.src = getInputURL(fileNode.files[0])
      Img.width = 100
      Img.height = 100
    }
  }
  updateAvatar = async () => {
    const fileobje = this.fileNode.files[0]
    let formData = new FormData()
    formData.append('avatar', fileobje)
    // const body = {
    //   user: {...this.state},
    //   formData
    // }
    let newPath
    try{
      const res = await axios.post('http://120.26.75.6:3002/settings/avatar', formData)
      if (res.data.err_code === 0) {
        newPath = res.data.newPath
        console.log('@@@',newPath);
      }
      else if(res.data.err_code === 1) {
        alert('请上传jpg, jfif, png或gif格式的文件')
      }
      else if(res.data.err_code === 500) {
        alert('服务器忙，请稍后重试')
      }
    }
    catch{
      alert('服务器忙，请稍后重试')
    }
    let user = {
      avatar: newPath,
      nickname: this.state.nickname,
      email: this.state.email,

    }
    console.log(user);
    this.setState({
      avatar: newPath
    })
    store.dispatch({type:'login',data:{...this.state}})
    PubSub.publish('user',{user})
    const body2 = {
      newPath,
      oldPath: this.state.avatar,
      nickname: this.state.nickname
    }
    await axios.post('http://120.26.75.6:3002/settings/avatarPath', body2)
    
    

  }

  render() {
    const {email, nickname, avatar, birthday, bio, preNickname} = this.state
    return (
      <section className="container">
        <div className="col-md-5">
          <form id="profile_form" onSubmit={this.handleSubmit}>
            <input type="text" name="email" value={email} hidden readOnly/>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">账号</label>
              <p className="form-control-static">{email}</p>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputNickname">昵称</label>
              <input type="text" className="form-control" id="exampleInputNickname" placeholder={preNickname} name="nickname" value={nickname} onChange={this.handleNicknameChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">介绍</label>
              <textarea className="form-control" rows="3" name="bio" value={bio} onChange={this.handleBioChange}></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">性别</label>
              <div>
                <label className="radio-inline">
                  <input type="radio" name="gender" id="inlineRadio1" value={1} onChange={this.handleGenderChange}/> 男
                </label>
                <label className="radio-inline">
                  <input type="radio" name="gender" id="inlineRadio2" value={0} onChange={this.handleGenderChange}/> 女
                </label>
                <label className="radio-inline">
                  <input type="radio" name="gender" id="inlineRadio3" value={-1} onChange={this.handleGenderChange}/> 保密
                </label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">生日</label>
              <input type="text" className="form-control" id="exampleInputPassword1" name="birthday" placeholder="格式为yyyy-MM-dd" value={birthday} onChange={this.handleBirthdayChange}/>
            </div>
            <button type="submit" className="btn btn-success">保存</button>
          </form>
        </div>
        <div className="col-md-2 profile-avatar">
          <dl>
            <dt>头像设置</dt>
            <dd>
              
              <div className="avatar">
                <img src={avatar} alt="默认头像" id="avatar" ref={c => this.Img = c} width={100} height={100}/>
              </div>
              <p></p>
              <div>
                <input type="file" name="avatar" id="up-avatar" ref={c => this.fileNode = c} onChange={this.displayAvatar(this)}/>
                <p></p>
                <button className="btn btn-default" id="button-avatar" onClick={this.updateAvatar}>上 传 图 片</button>
              </div>
            </dd>
          </dl>
        </div>
      </section>
    )
  }
}

