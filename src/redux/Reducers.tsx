import {combineReducers} from 'redux'
import {AUTH_SUCCESS,ERROR_MSG, RECEIVE_USER, RESET_USER, RECEIVE_USER_LIST, RECEIVE_MSG, RECEIVE_MSG_LIST, MSG_READ} from './Action-Types'
import { getRedirectTo } from '../utils'


let initUser = {
    username: '',
    type:'',
    msg:'',
    redirecTo:''
}


function user(state=initUser, action:any){
    switch(action.type){
        case AUTH_SUCCESS:
            const {type, header}= action.data
            return {...state, ...action.data,redirectTo:getRedirectTo(type,header)}
        case ERROR_MSG:
            return {...state, msg: action.data}
        case RECEIVE_USER:
            return action.data
        case RESET_USER:
            return  {...initUser, msg: action.data}
        default:
            return state
    }
}

const initUserList :any[]=[]
function userList(state=initUserList, action:any){
    switch(action.type){
        case  RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }
}


const initChat={
    users:{},
    chatMsgs: [],
    unReadCount: 0,
}
function chat(state=initChat, action:any) {
    switch (action.type) {
      case RECEIVE_MSG_LIST:  // data: {users, chatMsgs}
        const {users, chatMsgs, userid} = action.data
        return {
          users,
          chatMsgs,
          unReadCount: chatMsgs.reduce((preTotal:any, msg: any) => preTotal+(!msg.read&&msg.to===userid?1:0),0)
        }
      case RECEIVE_MSG: // data: chatMsg
        const {chatMsg} = action.data
        return {
          users: state.users,
          chatMsgs: [...state.chatMsgs, chatMsg],
          unReadCount: state.unReadCount + (!chatMsg.read&&chatMsg.to===action.data.userid?1:0)
        }
      case MSG_READ:
        const {from, to, count} = action.data
        state.chatMsgs.forEach((msg: any) => {
          if(msg.from===from && msg.to===to && !msg.read) {
            msg.read = true
          }
        })
        return {
          users: state.users,
          chatMsgs: state.chatMsgs.map((msg:any) => {
            if(msg.from===from && msg.to===to && !msg.read) { // 需要更新
              
              return {...msg, read: true}
            } else {
              // console.log(msg)

              return msg
            }
          }),
          unReadCount: state.unReadCount-count
        }
      default:
        return state
    }
  }
  


export default combineReducers({
    user, userList, chat
})