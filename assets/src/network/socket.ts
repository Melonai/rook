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

    shareChannel.on("new_request", requests.addRequest);

    shareChannel
        .join()
        .receive("error", err =>
            console.log("Failed joining share channel: " + JSON.stringify(err))
        );
};

export const joinRequestChannel = (token, share) => {
    let requestChannel = socket.channel(`request:${token}`, { share });

    requestChannel
        .join()
        .receive("ok", () => console.log("Connected to request!"))
        .receive("error", err =>
            console.log("Failed joining request channel:" + JSON.stringify(err))
        );
};
