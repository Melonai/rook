import type { Channel, Socket } from "phoenix";

export function connectSocket(socket: Socket): Promise<void> {
    return new Promise((resolve, _reject) => {
        socket.connect();
        socket.onOpen(() => {
            resolve();
        });
    });
}

export function fetchToken(socket: Socket): Promise<string> {
    let tokenChannel = socket.channel("token", {});
    return new Promise((resolve, reject) => {
        tokenChannel
            .join()
            .receive("ok", () => {
                tokenChannel
                    .push("get_token", {}, 5000)
                    .receive("ok", ({ token }) => resolve(token))
                    .receive("error", err => reject(err))
                    .receive("timeout", err => reject(err));
            })
            .receive("error", err => reject(err));
    });
}

export function joinShareChannel(
    socket: Socket,
    token: string
): Promise<Channel> {
    return joinChannel(socket, `share:${token}`);
}

export function joinRequestChannel(
    socket: Socket,
    request_token: string,
    share_token: string
): Promise<Channel> {
    return joinChannel(socket, `request:${request_token}`, {
        share: share_token,
    });
}

function joinChannel(
    socket: Socket,
    topic: string,
    opts?: object
): Promise<Channel> {
    let channel = socket.channel(topic, opts);

    return new Promise((resolve, reject) => {
        channel
            .join()
            .receive("ok", () => resolve(channel))
            .receive("error", err => reject(err))
            .receive("timeout", err => reject(err));
    });
}
