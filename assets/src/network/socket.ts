import { Socket } from "phoenix";
import requests from "../stores/requests";

let socket = new Socket("/socket", {});
socket.connect();

export const getToken: () => Promise<string> = () => {
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
};

export const joinShareChannel = token => {
    let shareChannel = socket.channel(`share:${token}`);

    shareChannel.on("request", requests.addRequest);

    shareChannel
        .join()
        .receive("error", err =>
            console.log("failed joining share channel:" + err)
        );
};
