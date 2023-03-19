import axios from 'axios'




//axios部分


const service = axios.create({
    baseURL : 'http://localhost:8080',
    timeout : 3000,
    headers: {
        "Content-Type": "application/json;"
    }
})

service.interceptors.request.use(config=>{



    return config;

},
    error => {
        Promise.reject(error);
    }
)


service.interceptors.response.use(response=>{

    if([200,201].includes(response.status)) {


        return Promise.resolve(response);
    }
    else{
        return Promise.reject(response);
    }
    //return response;

},error => {
    return Promise.resolve(error.response);
})

export default service;
