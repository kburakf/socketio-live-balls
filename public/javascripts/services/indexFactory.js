app.factory("indexFactory", [() => {
    const connectSocket = (url, options) => {
        return new Promise((res, rej) => {
            const socket = io.connect(url, options)

            socket.on("connect", () => {
                res(socket)
            })
            socket.on("connect_error", () => {
                rej(new Error("connect_error"))
            })
        })
    }
    return {
        connectSocket
    }
}])