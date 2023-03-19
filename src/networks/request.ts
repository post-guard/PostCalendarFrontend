import service from "@/networks/axios-defaults";



export function get(url:string,params:any){
    return new Promise((resolve,reject)=>{
        service.get(url,{
            params : params
        })
            .then(res=>{
                resolve(res.data);
            })
            .catch(err=>{
                reject(err.data);
            })
    })
}

export function post(url:string,params:any){
    return new Promise((resolve,reject)=>{
        service.post(url, params)

            .then(res=>{
                resolve(res.data);
            })
            .catch(err=>{
                reject(err.data);
            })
    })
}


export function setToken(token:string){

    localStorage.setItem("token",token);
    service.defaults.headers.common["Authorization"] = localStorage.getItem("token");
}
export default {get,post,setToken};
