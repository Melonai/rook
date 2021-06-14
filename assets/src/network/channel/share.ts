import requests from "../../stores/requests";
import {
    Connection,
    ConnectionState,
    on,
    onWithToken,
    updateState,
} from "./connection";
import type { UnregisterHandler } from "./messages/handler";
import type {
    NewRequestMessage,
    RequestCancelledMessage,
} from "./messages/messages";
import { joinShareChannel } from "./socket";

export async function startShare(connection: Connection) {
    updateState(ConnectionState.CONNECTING_CHANNEL);

    const shareChannel = await joinShareChannel(
        connection.socket,
        connection.token
    );
    connection.channel = shareChannel;

    on("new_request", onNewRequest);

    updateState(ConnectionState.CONNECTED);
}

function onNewRequest(message: NewRequestMessage) {
    const token = message.token;

    requests.addRequest(token);

    onWithToken("request_cancelled", token, onRequestCancelled);
}

function onRequestCancelled(
    message: RequestCancelledMessage,
    unregister: UnregisterHandler
) {
    const token = message.token;
    requests.removeRequest(token);
    unregister();
}
