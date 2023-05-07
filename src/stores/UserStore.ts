import type { User } from "@/models/User";
import { Request } from "@/utils/Request";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('user', ()=> {
    const user = ref<User>();
    const request = new Request();

    async function updateUserInformation(id : Number) : Promise<void> {
        try {
            const response = await request.get<User>(`/postcalendarapi/user/${id}`);
            user.value = response.data;
        } catch (err) {
            // TODO: 进一步处理错误
            console.log(err);
        }
    }

    return {user, updateUserInformation};
});