import io from "socket.io-client";
import {
    reqRegister,
    reqLogin,
    reqUpdateUser,
    reqUser,
    reqUserList,
    reqChatMsgList,
    reqReadMsg
  } from "./../api";
  import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_USER_LIST,
    RECEIVE_MSG,
    RECEIVE_MSG_LIST,
    MSG_READ
  } from "./Action-Types";
import { User } from "../model/user";

  
const authSuccess = (user:any) => ({
    type: AUTH_SUCCESS,
    data: user,
  });
  const errorMsg = (msg:any) => ({
    type: ERROR_MSG,
    data: msg,
  });
  
  const receiveUser = (user:any) => ({
    type: RECEIVE_USER,
    data: user,
  });
  
  export const resetUser = (msg:String) => ({
    type: RESET_USER,
    data: msg,
  });
  
  const receiveUserList = (userList:[]) => ({
    type: RECEIVE_USER_LIST,
    data: userList,
  });
  
  const receiveMsgList = ({users, chatMsgs, userid}: any)=>({
    type: RECEIVE_MSG_LIST,
    data: {users, chatMsgs,userid}
  })
  
  const receiveMsg =(chatMsg:[], userid:Number)=>({
    type: RECEIVE_MSG, data: {chatMsg, userid}
  })
  
  const msgRead = ({count, from, to}:any) => ({
    type: MSG_READ, data: {count, from, to}
  })


export const register = (user:any) => {
    const { username, password, password2, type } = user;
    if (!username && !password && !password2 && !type) {
      return errorMsg("No se han llenado todo los campos");
    } else if (!username) {
      return errorMsg("Ya existe este usuario");
    } else if (password !== password2) {
      return errorMsg("La contraseñas no coinciden");
    }
  
    return async (dispatch:any) => {
      const response = await reqRegister({ username, password, type });
      const result = response.data; // {code 0/1, data: user, msg:'}
      if (result.code === 0) {
        getMsgList(dispatch, result.data._id)
        dispatch(authSuccess(result.data));
      } else {
        dispatch(errorMsg(result.msg));
      }
    };
  };
  
  export const login = (user:User) => {
    const { username, password } = user;
  
    if (!username && !password) {
      return errorMsg("No existe este usuario");
    } else if (!username || !password) {
      return errorMsg("Credenciales invalidades");
    }
  
    return async (dispatch:any) => {
      const response = await reqLogin(user);
      const result = response.data;
      if (result.code === 0) {
        getMsgList(dispatch, result.data._id)
        dispatch(authSuccess(result.data));
      } else {
        dispatch(errorMsg(result.msg));
      }
    };
  };

  
function initIO(dispatch:any, userid:any) {
    if (!io.Socket) {
      io.Socket= io("ws://192.168.8.182:3001");
      
      io.Socket.on("receiveMsg", function (chatMsg:any) {
        console.log("El cliente recive el mensaje enviado por el servidor", chatMsg);
        // debugger
        if(userid===chatMsg.from || userid===chatMsg.to){
          dispatch(receiveMsg(chatMsg, userid))
        }
      });
    }
   
}

  
async function getMsgList(dispatch:any, userid:any){
    initIO(dispatch,userid);
    const response = await reqChatMsgList()
    const result = response.data
    if(result.code===0){
      const {users, chatMsgs} = result.data
      dispatch(receiveMsgList({users, chatMsgs, userid}))
    }
  }


  
export const readMsg = (from:string, to:string) => {
    return async (dispatch: (arg0: { type: string; data: { count: any; from: any; to: any; }; }) => void) => {
      const response = await reqReadMsg(from)
      const result = response.data
      if(result.code===0) {
        const count = result.data
        dispatch(msgRead({count, from, to}))
      }
    }
  }
  
  
  export const sendMsg = ({ from, to, content }:any) => {
    return (dispatch: any) => {
      console.log("El cliente envía mensajes al servidor =>", { from, to, content });
      io.Socket.emit('sendMsg', { from, to, content });
    };
  };


  
export const getUser = () => {
    return async (dispatch:any) => {
      const response = await reqUser();
      const result = response.data;
      console.log(result)
      if (result.code === 0) {
        getMsgList(dispatch, result.data._id)
        dispatch(receiveUser(result.data));
      } else {
        dispatch(resetUser(result.msg));
      }
    };
  };
  