// import io from 'socket.io-client'

// const socket = io('ws://192.168.1.111:3001')
export default  function  DrawI(canvasRef:any,colorsRef:any,sizeLSRef:any,current:any, socket:any, ){
    const colors = document.getElementsByClassName('color')
    if(canvasRef.current){

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        let drawing = false;

        // drawLine
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
            let data=[
                current.x,
                current.y, 
                e.clientX || e.touches[0].clientX, 
                e.clientY || e.touches[0].clientY, 
                colorsRef.current?.value,
                sizeLSRef.current?.value,
                true
            ]

            drawLine(context, canvas,data, socket)
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
            let data=[
                current.x, 
                current.y,
                e.clientX || e.touches[0].clientX, 
                e.clientY || e.touches[0].clientY, 
                colorsRef.current?.value,
                sizeLSRef.current?.value,
                true
            ]
            drawLine(context, canvas,data,socket);          
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

        console.log('HOLA')
        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mouseup', onMouseUp, false);
        canvas.addEventListener('mouseout', onMouseUp, false);
        canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

        canvas.addEventListener('touchstart', onMouseDown, false);
        canvas.addEventListener('touchend', onMouseUp, false);
        canvas.addEventListener('touchcancel', onMouseUp, false);
        canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);
    
    // }
    
    const onResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', onResize, false);
    onResize();

    returnDrawing(context,canvas)
    
}


    function returnDrawing(context:any,canvas:any){
        console.log("ReturnDrawin Socket")
        socket.on('return_drawing',  (data:any) => {
            const w : number = canvas.width;
            const h : number= canvas.height;
            const {drawing}=data
            
            let dataR=[
                drawing.x0 * w, 
                drawing.y0 * h,
                drawing.x1 * w,
                drawing.y1 * h,
                drawing.color,
                colorsRef.current?.value,
                // sizeLSRef.current?.value,
                false
            ]
            drawLine(context, canvas ,dataR, socket);
        })
        // socket.onclose=(evt:any)=>{
        //     console.log('Socket is closed.Reconnect will be attempted in 10 second.', evt.reason);
        //     setTimeout(() => socket.connect(), 10000);
        // }
    }
}



function drawLine (context:any, canvas:any, data:any,socket:any){
    let[x0, y0, x1, y1, color, lineWidth, emit]=data
    // const drawLine=(x0:any, y0:any, x1:any, y1:any, color:any, lineWidth:any, emit:Boolean)=>{
        if(context){
            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.strokeStyle = color;
            context.lineWidth = lineWidth;
            context.lineCap ='round'

            context.stroke();
            context.closePath();
       }

        if (!emit) { return; }

        // get size
        const w = canvas.width
        const h = canvas.height
        socket.emit('drawing', {
          x0: x0 / w,
          y0: y0 / h,
          x1: x1 / w,
          y1: y1 / h,
          color,
        //   lineWidth
        });
}