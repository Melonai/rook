import { newIncomingRequest } from "../../models/incoming_request";
import requests from "../../stores/received_requests";
import {
    ConnectionState,
    on,
    onWithToken,
    start,
    updateState,
} from "./connection";
import type { UnregisterFn } from "./messages/event_handler";
import type {
    NewRequestMessage,
    RequestCancelledMessage,
} from "./messages/messages";
import { joinShareChannel } from "./socket";

export async function startShareConnection() {
    const connection = await start();

    updateState(ConnectionState.CONNECTING_CHANNEL);

    const shareChannel = await joinShareChannel(
        connection.socket,
        connection.token
    );
    connection.channel = shareChannel;

    on("new_request", onNewRequest);

    updateState(ConnectionState.CONNECTED);
}

// Events which can happen without prior triggers during a share's lifetime

function onNewRequest(message: NewRequestMessage) {
    const token = message.token;

    const request = newIncomingRequest(
        token,
        message.ip,
        message.location,
        message.client
    );
    requests.addRequest(request);

    const unregister = onWithToken(
        "request_cancelled",
        token,
        (message: RequestCancelledMessage) => {
            onRequestCancelled(message, unregister);
        }
    );
}

function onRequestCancelled(
    message: RequestCancelledMessage,
    unregister: UnregisterFn
) {
    const token = message.token;
    requests.removeRequest(token);
    unregister();
}
