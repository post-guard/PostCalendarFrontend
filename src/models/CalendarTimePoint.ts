/**
 * 查询日程表时间点事件(DDL)返回的信息
 */
export interface CalendarTimePoint {

    id : number;
    name : string;
    details: string;
    userId: number;
    groupId: number;
    placeId: number;
    type: number;
    endDateTime: string;

}
