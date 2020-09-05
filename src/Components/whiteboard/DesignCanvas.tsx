import React, { useRef, useEffect,useState} from 'react'
import io from 'socket.io-client'
import DRaWI from './drawing'

const socket = io('ws://192.168.1.111:3001')

interface CanvasProps{
    width: number;
    height: number;
}

const current = {
    color: 'black',
    x:'0',
    y:'0'
}

const initialValue={
    backgroundColor:'#000000',
    sizeLW:7,
    isPencil:true
}

function getWindowDimensions(){
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };    
}
export function DesignCanvas({width, height}:CanvasProps){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const colorsRef = useRef<HTMLInputElement>(null)
    const sizeLSRef = useRef<HTMLInputElement>(null)
    
    const [state, statesetState]=useState(initialValue)
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());


    useEffect(()=>{
        DRaWI(canvasRef,colorsRef,sizeLSRef,current,socket)

        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    },[])
     
    const dp=(val:any)=>{
        return Math.sqrt(Math.pow(windowDimensions.width, 2) + Math.pow(windowDimensions.height, 2))*val/100
    }

    const onChangeT=(name:any,val:any, erase:boolean)=>{
        const value=val.target.value 
        console.log(val.target.value)
        statesetState({...state, [name]:value})
        // statesetState({...state, isPencil:true})


    }
    const onCLickT=()=>{
        statesetState({...state, isPencil:false})
        // console.log(state)
    }

   
           
    return(
        <>
            <canvas ref={canvasRef }className="whiteboard"style={{width:`${dp(width)}rem`,height:`${dp(height)}rem`,borderStyle:"dotted"}}/>
            <div  className="colors">
                <input ref={colorsRef} type="color" value={state.backgroundColor} onChange={(val)=>onChangeT('backgroundColor',val, false)}/>
                <div  onClick={()=>onCLickT()} >
                    Borrador
                </div>
                <input ref={sizeLSRef} type="number" value={state.sizeLW} onChange={(val)=>onChangeT('sizeLW',val, false)}/>
            </div> 
        </>
    )
}