import axios from 'axios'
import type {ComponentPublicInstance} from "@vue/runtime-core";
import type{ComponentInternalInstance} from "vue";


//axios部分


export interface Iaxios{


    Default(port:string,timeout:number) : void;
    Login(emailAddress:string,password:string,proxy:ComponentInternalInstance) : object;

    //Register() : object;


}
//axios.defaults.headers={get: '2f68dbbf-519d-4f01-9636-e2421b68f379'};
class AxiosClass implements Iaxios{

    Default = function (port:string,timeout:number) {
        axios.defaults.baseURL='http://localhost:'+port;
        axios.defaults.timeout= timeout;
    }

    Login = function (emailAddress:string,password:string,proxy:ComponentInternalInstance) : object{


        // @ts-ignore
        const responseOut = proxy?.$axios.get('/user/getUsers').then((response:object):object => {
            console.log(response);
            return response;
        })

        return responseOut;

    }



}
