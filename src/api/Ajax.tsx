
import axios from 'axios'


const baseUrl = ''

export default function Ajax(url:string, data:any={}, type='GET'){
    url=baseUrl+url
    if(type==='GET'){
        // data: {username: name, password:pass}
        // paramstr; username=namee&password=pass
        let paramStr=''
        Object.keys(data).forEach(key =>{
            paramStr += key + '=' +data[key] +'&'
        })

        if(paramStr){
            paramStr = paramStr.substring(0, paramStr.length-1)           
        }
        
        return axios.get(url + '?' + paramStr)
    }else{
        return axios.post(url, data)
    }
}