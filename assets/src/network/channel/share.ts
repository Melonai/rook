import requests from "../../stores/requests";
import type { Connection } from "./connection";
import { joinShareChannel } from "./socket";

export async function startShare(connection: Connection) {
    const shareChannel = await joinShareChannel(
        connection.socket,
        connection.token
    );
    connection.channel = shareChannel;
}