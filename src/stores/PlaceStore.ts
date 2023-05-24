import type { IMapPoint } from "@/models/IMapPoint";
import { defineStore } from "pinia";
import { ref } from "vue";


export const usePlaceStore = defineStore("place", () => {
    const nowPosition = ref<IMapPoint>();
    const navigationList = ref<number[]>();

    function setPlace(place: IMapPoint) {
        nowPosition.value = place;
    }

    function setNavigationList(idList: number[]) {
        navigationList.value = idList;
    }

    return {
        nowPosition,
        navigationList,
        setPlace,
        setNavigationList
    }
});