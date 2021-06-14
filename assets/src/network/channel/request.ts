import getShareToken from "../../utils/getShareToken";
import { answer } from "../transfer/request";
import { Connection, ConnectionState, on, updateState } from "./connection";
import type { RequestAcceptedMessage } from "./messages/messages";
import { joinRequestChannel } from "./socket";

export async function startRequest(connection: Connection) {
    updateState(ConnectionState.CONNECTING_CHANNEL);

    const requestChannel = await joinRequestChannel(
        connection.socket,
        connection.token,
        getShareToken()
    );
    connection.channel = requestChannel;

    on("request_accepted", onRequestAccepted);

    updateState(ConnectionState.CONNECTED);
}

async function onRequestAccepted(message: RequestAcceptedMessage) {
    await answer(message);
}
