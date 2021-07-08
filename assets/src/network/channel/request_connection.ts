import {
    requestAccepted,
    OwnRequest,
    OwnRequestState,
} from "../../models/own_request";
import getShareToken from "../../utils/getShareToken";
import { ConnectionState, on, start, updateState } from "./connection";
import type {
    RequestAcceptedMessage,
    ShareCancelledMessage,
} from "./messages/messages";
import { joinRequestChannel } from "./socket";

export async function startRequestConnection(ownRequest: OwnRequest) {
    const connection = await start();

    updateState(ConnectionState.CONNECTING_CHANNEL);

    const requestChannel = await joinRequestChannel(
        connection.socket,
        connection.token,
        getShareToken()
    );
    connection.channel = requestChannel;

    on("request_accepted", (message: RequestAcceptedMessage) =>
        onRequestAccepted(message, ownRequest)
    );

    on("share_cancelled", (message: ShareCancelledMessage) =>
        onShareCancelled(message, ownRequest)
    );

    updateState(ConnectionState.CONNECTED);
}

// Events which can happen without prior triggers during a request's lifetime

function onRequestAccepted(
    message: RequestAcceptedMessage,
    request: OwnRequest
) {
    requestAccepted(request, message);
}

function onShareCancelled(message: ShareCancelledMessage, request: OwnRequest) {
    request.state.set(OwnRequestState.SHARE_CANCELLED);
}