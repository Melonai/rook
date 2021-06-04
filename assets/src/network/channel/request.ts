import getShareToken from "../../utils/getShareToken";
import { answer } from "../transfer/transfer";
import { Connection, on } from "./connection";
import type { RequestAcceptedMessage } from "./messages/messages";
import { joinRequestChannel } from "./socket";

export async function startRequest(connection: Connection) {
    const requestChannel = await joinRequestChannel(
        connection.socket,
        connection.token,
        getShareToken()
    );
    connection.channel = requestChannel;

    on("request_accepted", onRequestAccepted);
}

async function onRequestAccepted(message: RequestAcceptedMessage) {
    await answer(message);
}
