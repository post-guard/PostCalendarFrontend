import request, {setToken} from "@/networks/request";


/**
 * 登录相关服务
 * @param url 网址
 * @param data 登录要发送的字段
 */
export function loginService(url:string,data:object):object{

    const responseOut:object =
    request.post(url,data).then((response:any) =>{
        console.log(response);

        if(response.message === "登录成功"){
            setToken(response.data.token);

            console.log("Set token successfully:"+ localStorage.getItem("token"));
        }
        return response;



    });

    return responseOut;
}


/**
 * 注册相关服务
 * @param url 网址
 * @param data 注册要发送的字段
 */
export function registerService(url:string,data:object):object{



    let responseOut:object;
        responseOut = request.post(url, data).then((response: any): string => {

            //TODO:注意看，这里想向外传参返回一个注册是否成功的字符串或者状态，以便注册页的卡片部件进行提醒，
            // 但是回调函数只会返回Promise类型的变量，考虑在外部解析Promise变量，或者在内部就将Promise的字段转为string传出
            // 但是迷惑的是好像没生效，，，说了这么多，可以去打原了（
            switch (response.message) {
                case '注册成功':
                    return '注册成功';
                    break;

                case '注册失败':
                    return  '注册失败';
                    break;

                default:
                    return  '';


            }


        });


    console.log(responseOut);
    return responseOut;
}


/**
 * 获得列表中的全部用户
 * @param url 网址
 */
export function getAllUsers(url:string){

    request.get(url,null).then((response:any)=>{
        console.log(response);
    })
}