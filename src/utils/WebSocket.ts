interface ISocket{
    socket:WebSocket;
    setIntervalWebsocketPush:number;
    ip:string;
}

export const Sockets:Socket[]=[];

export class Socket implements ISocket{
    public ip: string;
    public setIntervalWebsocketPush: number;
    public socket: WebSocket;
    public type:string;

    public constructor(ip:string,setIntervalWebsocketPush:number,socket:WebSocket,type:string){
        this.ip = ip;
        this.setIntervalWebsocketPush = setIntervalWebsocketPush;
        this.socket = socket;
        this.type = type;

        //发送心跳
        this.socket.onopen = this.onopenWS
        //接收消息
        this.socket.onmessage = this.onmessageWS
        //连接失败重连
        this.socket.onerror = this.onerrorWS
        //断开重连
        this.socket.onclose = this.oncloseWS
    }


    /**打开WS之后发送心跳 */
    public onopenWS = () => {
        //this.sendPing()
    }

    /**连接失败重连 */
    public onerrorWS = () => {
        this.socket.close()
        clearInterval(this.setIntervalWebsocketPush)
        console.log("websocket:"+this.ip+'连接失败重连中')
        if (this.socket.readyState !== 3) {
            //Socket = null
            createSocket(this.ip,this.type)
        }
    }

    /**WS数据接收统一处理 */
    public onmessageWS = (e:any) => {
        window.dispatchEvent(new CustomEvent('onmessageWS', {
            detail: {
                data: e.data,
                type: this.type
            }
        }))
    }

    /**
     * 发送数据但连接未建立时进行处理等待重发
     * @param {any} message 需要发送的数据
     */
    /*public connecting = (message:string,socket:WebSocket) => {
        setTimeout(() => {
            if (socket.readyState === 0) {
                connecting(message,socket)
            } else {
                socket.send(JSON.stringify(message))
            }
        }, 1000)
    }*/

    /**
     * 发送数据
     * @param {any} message 需要发送的数据
     */
    /*export const sendWSPush = (message:string,socket:WebSocket) => {
        if (socket !== null && socket.readyState === 3) {
            socket.close()
            createSocket(ip)
        } else if (socket !== null && socket.readyState === 1) {
            socket.send(JSON.stringify(message))
        } else if (socket !== null && socket.readyState === 0) {
            connecting(message)
        }
    }*/

    /**断开重连 */
    public oncloseWS = () => {
        clearInterval(this.setIntervalWebsocketPush)
        console.log('websocket'+this.ip+'已断开....正在尝试重连')
        if (this.socket.readyState !== 2) {
            //Socket = null
            const inheritIp = this.ip;
            const inheritType = this.type;

            Sockets.splice(Sockets.indexOf(this),1);
            createSocket(inheritIp,inheritType)
        }
    }
    /**发送心跳
     * @param {number} time 心跳间隔毫秒 默认5000
     * @param {string} ping 心跳名称 默认字符串ping
     */
    public sendPing = (time = 5000, ping = 'ping') => {
        clearInterval(this.setIntervalWebsocketPush)
        this.socket.send(ping)
        this.setIntervalWebsocketPush = setInterval(() => {
            this.socket.send(ping)
        }, time)
    }
}



/**
 * 建立websocket连接
 * @param {string} url ws地址
 * @param type websocket的类型（闹钟，日志）
 */
export const createSocket = (url:string,type:string) => {
    //Socket && Socket.close()

    const hasSocket = ()=>{

        for(let socket of Sockets){
            if(socket.ip==url){
                return true;
            }
        }
        return false;
    }

    if (!hasSocket()) {

        console.log("建立websocket"+url+"连接");
        //建立连接的时候缓存服务端ip以便于其他方法调用

        const newSocket : Socket = new Socket(url,-1,new WebSocket(url),type);

        Sockets.push(newSocket)

    } else {
        console.log("websocket:"+url+"已连接")
    }

    console.log(Sockets)
}


