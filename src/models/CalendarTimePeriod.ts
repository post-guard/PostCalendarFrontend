/**
 * 查询日程表时间段事件返回的信息
 */
export interface CalendarTimePeriod {

    id : number;
    name : string;
    details: string;
    userId: number;
    groupId: number;
    placeId: number;
    beginDateTime: string;
    endDateTime: string;

}
