import {createStore} from 'redux'
//引入为Count组件服务的reducer
import userReducer from './user_reducer'
//暴露store

export default createStore(userReducer)
