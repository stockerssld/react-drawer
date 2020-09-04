import React, { useRef, useEffect,useState} from 'react'
import io from 'socket.io-client'

const socket = io('ws://192.168.1.110:3001')

interface CanvasProps{
    width: number;
    height: number;
}

const current = {
    color: 'black',
    x:'0',
    y:'0'
}
export function DesignCanvas({width, height}:CanvasProps){

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const colorsRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        const colors = document.getElementsByClassName('color')
        if(canvasRef.current){
            const canvas = canvasRef.current
            const context = canvas.getContext('2d')
            let drawing = false;

          const drawLine=(x0:any, y0:any, x1:any, y1:any, color:any, emit:Boolean)=>{
            if(context){
                context.beginPath();
                context.moveTo(x0, y0);
                context.lineTo(x1, y1);
                context.strokeStyle = color;
                context.lineWidth = 2;
                context.stroke();
                context.closePath();
           }
            if (!emit) { return; }

            // get size
            const w = canvas.width
            const h = canvas.height
            console.log(w,h)
            socket.emit('drawing', {
              x0: x0 / w,
              y0: y0 / h,
              x1: x1 / w,
              y1: y1 / h,
              color,
            });
        };

        //Obtiene el punto de partida del raton en resolucion de la pantalla=>=>=>throttle=>TE
        const onMouseDown = (e: any) => {
            drawing = true;
            try {
                current.x = e.clientX || e.touches[0].clientX;
                current.y = e.clientY || e.touches[0].clientY;
            } catch (error) {
                console.log(error)
            }
                
          };
      
        const onMouseMove = (e:any) => {
            if (!drawing) { return; }
            try {
                drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, colorsRef.current?.value, true);
                current.x = e.clientX || e.touches[0].clientX;
                current.y = e.clientY || e.touches[0].clientY;
            } catch (error) {
                console.log(error)
            }
        };
      
          const onMouseUp = (e:any) => {
            if (!drawing) { return; }
            drawing = false;
            try {
                drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, colorsRef.current?.value, true);          
            } catch (error) {
                console.log(error)
            }
            
          };
      
      
          const throttle = (callback:any, delay:any) => {
            let previousCall = new Date().getTime();
            return function() {
              const time = new Date().getTime();
      
              if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
              }
            };
          };

            canvas.addEventListener('mousedown', onMouseDown, false);
            canvas.addEventListener('mouseup', onMouseUp, false);
            canvas.addEventListener('mouseout', onMouseUp, false);
            canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

            canvas.addEventListener('touchstart', onMouseDown, false);
            canvas.addEventListener('touchend', onMouseUp, false);
            canvas.addEventListener('touchcancel', onMouseUp, false);
            canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);
        
        
        const onResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
    
        window.addEventListener('resize', onResize, false);
        onResize();
    
    
        socket.on('return_drawing',  (data:any) => {
            const w : number = canvas.width;
            const h : number= canvas.height;
            const {drawing}=data

            drawLine(drawing.x0 * w, drawing.y0 * h,
                drawing.x1 * w,
                drawing.y1 * h
                , drawing.color,
            false);
        })
    }
   

    },[])


    const getCursor:Function=(id:any)=>{
        const elementId='cursor-'+id;
        let element = document.getElementById(elementId)
        if(element==null){
            element = document.createElement('div')
            element.id = elementId
            element.className="cursor"
                document.body.appendChild(element)

            }
        return element
    }
    return(
        <>
        <canvas ref={canvasRef }className="whiteboard"style={{width:`${width} rem`,height:`${height} rem`}}/>
        <div  className="colors">
          <input ref={colorsRef} type="color"/>
        </div> 
        </>
    )
}