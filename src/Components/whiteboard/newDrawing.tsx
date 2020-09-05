export default function DrawI(canvasRef: any, colorsRef: any, sizeLSRef: any, current: any, socket: any,isPencil:any) {
    let pos:any = {}
    let end: any;
    let color = "#000"
    let size=5
    
    console.log(isPencil)
    if (canvasRef.current) {
        const canvas = canvasRef.current
        
        if(!isPencil){
            color = canvas.style.backgroundColor
        }else{
            if(colorsRef.current){
                color = colorsRef.current.value
            }
        }
        
        if(sizeLSRef.current){
            size = sizeLSRef.current.value
        }

        const context = canvas.getContext('2d')
        let drawing = false;
        if (context) {
            canvas.onmousedown = function (e: any) {
                drawing = true;
                pos = adjust(canvas, e.clientX, e.clientY)
            }
            canvas.onmousemove = function (e: any) {
                if (!drawing) { return; }
                if (drawing) {
                    end = adjust(canvas, e.clientX, e.clientY)                   
                    const { x:x0, y:y0 } = pos
                    const { x:x1, y:y1 } = end
                    let data = [
                        x0,y0,x1,y1,color,size,true
                    ]
                    drawLine(context, canvas, data ,socket, isPencil)
                    pos = end
                }
            }
            canvas.onmouseup = function (e: any) {
                if (!drawing) { return; }
                drawing = false;
                if (drawing) {
                    end = adjust(canvas, e.clientX, e.clientY)
                    const { x:x0, y:y0 } = pos
                    const { x:x1, y:y1 } = end

                    let data = [
                        x0,y0,x1,y1,color,size,true
                    ]
                    drawLine(context, canvas, data,socket, isPencil)
                    pos = end
                }
            }
            canvas.onpointerdown = function (e: any) {
                drawing = true;
                pos = adjust(canvas, e.clientX, e.clientY)
            }
            canvas.onpointerrawupdate = function (e: any) {
                if (!drawing) { return; }
                if (drawing) {
                    end = adjust(canvas, e.clientX, e.clientY)
                    const { x:x0, y:y0 } = pos
                    const { x:x1, y:y1 } = end

                    let data = [
                        x0,y0,x1,y1,color,size,true
                    ]
                    drawLine(context, canvas,data,socket, isPencil)
                    pos = end
                }
            }
            canvas.onpointerup = function (e: any) {
                if (!drawing) { return; }

                drawing = false;
                if (drawing) {
                    end = adjust(canvas, e.clientX, e.clientY)
                    const { x:x0, y:y0 } = pos
                    const { x:x1, y:y1 } = end

                    let data = [
                        x0,y0,x1,y1,color,size, true
                    ]
                    drawLine(context, canvas, data,socket, isPencil)
                    pos = end
                }
            }
        }
        returnDrawing(context, canvas)
    }


    function returnDrawing(context: any, canvas: any) {
        console.log('Return Drawing of socket')
        socket.on('return_drawing', (data: any) => {
            const w: number = canvas.width;
            const h: number = canvas.height;

            const {drawing}= data
            // console.log(drawing)
            let dataR = [
                drawing.x0 * w,
                drawing.y0 * h,
                drawing.x1 * w,
                drawing.y1 * h,
                drawing.color,
                drawing.size,
                false
            ]
            drawLine(context, canvas, dataR, socket, isPencil);

        })
    }
}

function drawLine(context: any, canvas: any, data:any,socket:any, isPencil:any) {
    let [x0, y0, x1, y1, color,size, emit] = data
    if (context) {
        context.beginPath()
        if(isPencil){
            context.strokeStyle = color
        }else{
            context.strokeStyle = canvas.style.backgroundColor
        }
        context.strokeStyle = color
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.lineWidth = size;
        context.lineCap ='round'

        context.stroke();
        context.closePath();//BORRAR //TODO
    }
    if (!emit) { return; }
    const w = canvas.width
    const h = canvas.height
    socket.emit('drawing', {
        // inicio, fin
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color,
        size
    });
}

let adjust = function (canvas: any, xx: any, yy: any): any {
    var postCanvas = canvas.getBoundingClientRect()
    var x = xx - postCanvas.left;
    var y = yy - postCanvas.top;
    return { x: x, y: y }
}

// function pintaGrid(canvas:any, ctx: any,disX:any, disY:any){
//     console.log(disX, disY)
//     if(ctx){
//         ctx.strokeStyle = "#cccccc"; //Color
//         ctx.lineWidth =0.5 //Pinta en pixeles, angosto

//         for(var i= disX+0.5;i<canvas.width; i+=disX){
//             ctx.beginPath()
//             ctx.moveTo(i, 0)//Y siempre es 0
//             ctx.lineTo(i,ctx.canvas.height)
//             ctx.stroke()
//         }

//         for(var i= disY+0.5;i<canvas.width; i+=disY){
//             ctx.beginPath()
//             ctx.moveTo(0,i)//Y siempre es 0
//             ctx.lineTo(ctx.canvas.width,i)
//             ctx.stroke()
//         }

//     }
// }