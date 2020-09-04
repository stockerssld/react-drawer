import Ajax from './Ajax'
import { User } from '../model/user'

//Crear nuevo usuario
export const reqRegister = (user:User) => Ajax('/register', user, 'POST')
//Iniciar Sesión
export const reqLogin = ({ username, password}:User) =>Ajax('/login', {username, password}, 'POST')  //any
//Actualizar usuario
export const reqUpdateUser = (user:User) => Ajax('/update', user, 'POST')
//Obtiene los usuarios
export const reqUser = () => Ajax('/user')

export const reqUserList =(type:String)=>Ajax('/userlist', {type})

export const reqChatMsgList = ()=> Ajax('/msglist')

export const reqReadMsg = (from:String) => Ajax('/readmsg', {from}, 'POST')