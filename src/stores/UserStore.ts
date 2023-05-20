import type { IGroup } from "@/models/IGroup";
import type { ILoginToken } from "@/models/ILoginToken";
import type { IUserGroupLink } from "@/models/IUserGroupLink";
import type { User } from "@/models/User";
import { Request } from "@/utils/Request";
import { WebStorage } from "@/utils/Storage";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('user', ()=> {
    const user = ref<User>();
    const request = new Request();
    const userPermission = ref(0);

    async function updateUserInformation() : Promise<void> {
        const storage = new WebStorage("localStorage");
        const token = storage.getKey<ILoginToken>("token");

        if (user.value != undefined) {
            return;
        }
        
        if (token != null) {
            Request.setAuthorizationToken(token.token);

            try {
                // 获得用户信息
                const response = await request.get<User>(`/postcalendarapi/user/${token.id}`);
                user.value = response.data;
    
                // 获得默认用户组的ID
                const groupResponse = await request.get<IGroup[]>("/postcalendarapi/group/");
                let defaultGroupId = 0;
                for (const group of groupResponse.data) {
                    if (group.name == "users") {
                        defaultGroupId = group.id;
                        break;
                    }
                }
    
                // 获得用户在默认用户组中的权限
                const linkResponse = await request.get<IUserGroupLink[]>(`/postcalendarapi/groupLink/user/${token.id}`);
                for (const link of linkResponse.data) {
                    if (link.groupId == defaultGroupId) {
                        userPermission.value = link.permission;
                        break;
                    }
                }
            } catch (err) {
                // TODO: 进一步处理错误
                console.log(err);
            }   
        }
    }

    return {user, userPermission, updateUserInformation};
});
