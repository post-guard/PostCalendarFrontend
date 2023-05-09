

export class CoordinateLine{

    public startPointId:number;

    public endPointId:number;

    public name:string;

    public length:number;

    public id:number




    constructor(startPointId:number,endPointId:number,name:string,length:number) {

        this.startPointId = startPointId;
        this.endPointId = endPointId;
        this.name = name;
        this.length = length;
        this.id = -1;

    }
}
