import requests from "../../stores/requests";
import { Connection, on, onWithToken } from "./connection";
import type { UnregisterHandler } from "./messages/handler";
import type {
    NewRequestMessage,
    RequestCancelledMessage,
} from "./messages/messages";
import { joinShareChannel } from "./socket";

export async function startShare(connection: Connection) {
    const shareChannel = await joinShareChannel(
        connection.socket,
        connection.token
    );
    connection.channel = shareChannel;

    on("new_request", onNewRequest);
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
