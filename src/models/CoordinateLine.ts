import type {Line} from "fabric";


export class CoordinateLine{

    public startPointId:number;

    public endPointId:number;

    public name:string;

    public length:number;

    public id:number;

    public react_image:Line;



    constructor(startPointId:number,endPointId:number,name:string,length:number,react_image:Line) {

        this.startPointId = startPointId;
        this.endPointId = endPointId;
        this.name = name;
        this.length = length;
        this.react_image = react_image;
        this.id = -1;

    }
}
