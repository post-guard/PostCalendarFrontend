let Socket:WebSocket;
let setIntervalWebsocketPush:number;

//缓存ip
let ip = ''
/**
 * 建立websocket连接
 * @param {string} url ws地址
 */
export const createSocket = (url:string) => {
    Socket && Socket.close()
    if (!Socket) {
        console.log('建立websocket连接')
        //建立连接的时候缓存服务端ip以便于其他方法调用
        ip = url;
        Socket = new WebSocket(url)
        //发送心跳
        Socket.onopen = onopenWS
        //接收消息
        Socket.onmessage = onmessageWS
        //连接失败重连
        Socket.onerror = onerrorWS
        //断开重连
        Socket.onclose = oncloseWS
    } else {
        console.log('websocket已连接')
    }
}

/**打开WS之后发送心跳 */
const onopenWS = () => {
    sendPing()
}

/**连接失败重连 */
const onerrorWS = () => {
    Socket.close()
    clearInterval(setIntervalWebsocketPush)
    console.log('连接失败重连中')
    if (Socket.readyState !== 3) {
        //Socket = null
        createSocket(ip)
    }
}

/**WS数据接收统一处理 */
const onmessageWS = (e:any) => {
    window.dispatchEvent(new CustomEvent('onmessageWS', {
        detail: {
            data: e.data
        }
    }))
}

/**
 * 发送数据但连接未建立时进行处理等待重发
 * @param {any} message 需要发送的数据
 */
const connecting = (message:string) => {
    setTimeout(() => {
        if (Socket.readyState === 0) {
            connecting(message)
        } else {
            Socket.send(JSON.stringify(message))
        }
    }, 1000)
}

/**
 * 发送数据
 * @param {any} message 需要发送的数据
 */
export const sendWSPush = (message:string) => {
    if (Socket !== null && Socket.readyState === 3) {
        Socket.close()
        createSocket(ip)
    } else if (Socket !== null && Socket.readyState === 1) {
        Socket.send(JSON.stringify(message))
    } else if (Socket !== null && Socket.readyState === 0) {
        connecting(message)
    }
}

/**断开重连 */
const oncloseWS = () => {
    clearInterval(setIntervalWebsocketPush)
    console.log('websocket已断开....正在尝试重连')
    if (Socket.readyState !== 2) {
        //Socket = null
        createSocket(ip)
    }
}
/**发送心跳
 * @param {number} time 心跳间隔毫秒 默认5000
 * @param {string} ping 心跳名称 默认字符串ping
 */
export const sendPing = (time = 5000, ping = 'ping') => {
    clearInterval(setIntervalWebsocketPush)
    Socket.send(ping)
    setIntervalWebsocketPush = setInterval(() => {
        Socket.send(ping)
    }, time)
}
