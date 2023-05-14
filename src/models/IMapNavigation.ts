import type {IMapPoint} from "@/models/IMapPoint";
import type {IMapRoad} from "@/models/IMapRoad";

/**
 * 导航请求返回的信息
 */
export interface IMapNavigation {

    places:IMapPoint[];
    roads:IMapRoad[];

}
