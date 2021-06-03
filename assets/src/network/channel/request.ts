import getShareToken from "../../utils/getShareToken";
import type { Connection } from "./connection";
import { joinRequestChannel } from "./socket";

export async function startRequest(connection: Connection) {
    const requestChannel = await joinRequestChannel(
        connection.socket,
        connection.token,
        getShareToken()
    );
    connection.channel = requestChannel;
}
