export function getAngle(start:{x:number,y:number},end:{x:number,y:number}) {
    const diff_x = end.x - start.x,
        diff_y = end.y - start.y;
    //返回角度，不是弧度
    return 360*Math.atan(diff_y/diff_x)/(2*Math.PI);
}

export function getLength(start:{x:number,y:number},end:{x:number,y:number}) {
    const diff_x = end.x - start.x,
        diff_y = end.y - start.y;

    return Math.sqrt(diff_x*diff_x+diff_y*diff_y);
}
