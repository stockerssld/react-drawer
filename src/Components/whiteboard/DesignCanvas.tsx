import React, { useRef, useEffect,useState} from 'react'
import io from 'socket.io-client'
import DRaWI from './newDrawing'

const socket = io('ws://192.168.1.109:3001')

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
export function DesignCanvas(){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const colorsRef = useRef<HTMLInputElement>(null)
    const sizeLSRef = useRef<HTMLInputElement>(null)
    
    const [state, statesetState]=useState(initialValue)
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());


    useEffect(()=>{
        DRaWI(canvasRef,colorsRef,sizeLSRef,current,socket,state.isPencil)

        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    },[windowDimensions,colorsRef.current?.value, sizeLSRef.current?.value, state.isPencil])
     
    const dp=(val:any)=>{
        return Math.sqrt(Math.pow(windowDimensions.width, 2) + Math.pow(windowDimensions.height, 2))*val/100
    }

    const onChangeT=(name:any,val:any, erase:boolean)=>{
        const value=val.target.value 
        statesetState({...state, [name]:value, isPencil:erase})
    }

    const onCLickT=()=>{
        statesetState({...state, isPencil:false})
    }  
    return(
        <>
            <div  className="colors">
                <input ref={colorsRef} type="color" value={state.backgroundColor} onChange={(val)=>onChangeT('backgroundColor',val, true)}/>
                <div  onClick={()=>onCLickT()} >
                    Borrador
                </div>
                <input ref={sizeLSRef} type="number" value={state.sizeLW} onChange={(val)=>onChangeT('sizeLW',val, false)}/>
            </div>  
             <canvas ref={canvasRef }    id="canvas" width={dp(50)} height={dp(50)} style={{backgroundColor:'green'}}>
                Tu navegador no soporta canvas
            </canvas>
        </>
    )
}
