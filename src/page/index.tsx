import React, {useEffect} from 'react'
import {fromEvent} from 'rxjs'
import { map,tap} from 'rxjs/operators'
import io from 'socket.io-client'

const socket = io('ws://localhost:3001')
const mouseMOVE$  = fromEvent<MouseEvent>(document,'mousemove') 
const sizeRE$ = fromEvent<Screen>(document,'width')
export default function(){
    console.log(sizeRE$)
    mouseMOVE$.pipe(
        map(({clientX, clientY})=>({
            clientX, clientY
        })),    
    )
    .subscribe({
        next: (val)=>{
            socket.emit('mouse_activity', {val})
        }
    })

    useEffect(()=>{
        socket.on('all_mouse_activity',(data:any)=>{
            const el = getCursor(data.session_id)
            el.style.left = `${data.coords.val.clientX}px`
            el.style.top = `${data.coords.val.clientY}px`

            // console.log(data.coords.val.clientX)
            // console.log(el)
            // el.style.x='300'
            // el.style.x = data.coords.val.clientX
            // el.style.y = data.coords.val.clientY
            

           
            
            // if($('.pointer[session_id]="' +data.session_id +'"]')<=0){
            //     $('body').append('<div class="pointer" session_id="'+data.session_id+'">')
            // }
            // var $pointer = $('.pointer[session_id"'+data.session_id+'"]')

            // $pointer.css('left', data.coords.x)
            // $pointer.css('top', data.coords.y)
            
        })
    },[])

    const getCursor:Function=(id:any)=>{
        const elementId='cursor-'+id;
        let element = document.getElementById(elementId)
        if(element==null){
            element = document.createElement('div')
            element.id = elementId
            element.className="cursor"
                document.body.appendChild(element)
                console.log("creacion",element.className)

            }
        return element
    }

    return(
        <div style={{color:'blue'}}>
         Hola
        </div>
    )
}