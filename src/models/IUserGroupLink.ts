export interface IUserGroupLink {
    id: number;
    userId: number;
    groupId: number;
    permission: number;
}

export function getPermissionName(permission: number): string {
    switch(permission) {
        case 0:
            return "用户";
        case 1:
            return "管理员";
        case 2:
            return "超级管理员";
        default:
            return "???";
    }
}