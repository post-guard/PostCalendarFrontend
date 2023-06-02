<template>
    <a-modal v-model:visible="visible"
             centered title="导入学校课表"
             @ok="importEvent"
             :ok-button-props="{ disabled: okButtonDisable }">
        <a-form>
            <a-form-item>
                <a-input v-model:value="schoolId"
                         placeholder="教务系统账号"
                         size="large">

                </a-input>

            </a-form-item>
            <a-form-item>
                <a-input v-model:value="schoolPassword"
                         placeholder="教务系统密码"
                         type="password"
                         size="large">

                </a-input>
            </a-form-item>

            <a-form-item>
                <a-select

                    v-model:value="schoolSemester"
                    :options="schoolSemesterOption"
                    placeholder="导入学期"
                    size="large"

                ></a-select>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">

import {computed, onMounted, ref} from "vue";

import type {AxiosError} from "axios";
import type {IResponse} from "@/models/IResponse";
import {Request} from "@/utils/Request";
import type {ISchoolSemester} from "@/models/ISchoolSemester";


const visible = ref(false);
defineExpose({visible})

const request = new Request();

const schoolId = ref();
const schoolPassword = ref();
const schoolSemester = ref();
const schoolSemesterOption = ref<{value:string,label:string}[]>([]);

const okButtonDisable = computed(()=>{
    return !(schoolId.value && schoolPassword.value && schoolSemester.value)
})

const emit = defineEmits<{
    (event:'importEvent',
     val: {
         schoolId:string,
         schoolPassword:string,
         schoolSemester:string
     }):void;
}>()

onMounted(async ()=>{

    try {

        const response =  await request.get<ISchoolSemester[]>
        (`/postcalendarapi/curriculum/semesters`);

        console.log(response.data)

        for(let semester of response.data){
            schoolSemesterOption.value.push({value:semester.semester,label:semester.semester});
        }


    }catch (err){
        const axiosError = err as AxiosError<IResponse<ISchoolSemester[]>>;
        if (axiosError.response?.status != undefined &&
            axiosError.response.status >= 400 && axiosError.response.status < 500) {
        }
    }
})

function importEvent(){
    emit("importEvent",{
        schoolId:schoolId.value,
        schoolPassword:schoolPassword.value,
        schoolSemester:schoolSemester.value
    })
    visible.value = false;
}
</script>

<style scoped>

</style>
