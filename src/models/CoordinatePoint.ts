export class CoordinatePoint{

    public positionX:number;

    public positionY:number;

    public name:string;

    public placeType:number;

    public id:number




    constructor(positionX:number,positionY:number,name:string,placeType:number) {

        this.positionX = positionX;
        this.positionY = positionY;
        this.name = name;
        this.placeType = placeType;
        this.id = -1;

    }
}
