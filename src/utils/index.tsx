
export function getRedirectTo(type:String, header: String){
    let path=''
    // console.log(type)
    if(type==='user'){
        path='/user'
    }else{
        path='/admin'
    }

    if(!header){
        path+='Info'
    }
    return path
}