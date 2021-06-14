import { Channel, Push, Socket } from "phoenix";
import {
    Handler,
    Handlers,
    registerTokenHandler,
    UnregisterHandler,
} from "./messages/handler";
import type { AnyMessage } from "./messages/messages";
import { connectSocket, fetchToken } from "./socket";

export enum ConnectionState {
    CONNECTING_SOCKET,
    FETCHING_TOKEN,
    CONNECTING_CHANNEL,

    CONNECTED,
}

export type Connection = {
    socket: Socket;
    channel: Channel | null;
    token: string | null;
    state: ConnectionState;
    handlers: Handlers;
};

const connection: Connection = {
    socket: new Socket("/socket", {}),
    channel: null,
    token: null,
    state: ConnectionState.CONNECTING_SOCKET,
    handlers: {},
};

export async function start() {
    await connectSocket(connection.socket);

    updateState(ConnectionState.FETCHING_TOKEN);
    connection.token = await fetchToken(connection.socket);

    return connection;
}

export function send(event: string, data: any): Push {
    if (connection.state !== ConnectionState.CONNECTED) {
        throw new Error("There is no connection yet.");
    }

    return connection.channel.push(event, data);
}

export function onWithToken<Message extends AnyMessage>(
    event: string,
    token: string | null,
    handler: Handler<Message>
): UnregisterHandler {
    return registerTokenHandler(
        connection.handlers,
        connection.channel,
        event,
        token,
        handler
    );
}

export function on<Message extends AnyMessage>(
    event: string,
    handler: Handler<Message>
): UnregisterHandler {
    return onWithToken(event, null, handler);
}

export function getOwnToken(): string {
    if (connection.state <= ConnectionState.FETCHING_TOKEN) {
        throw new Error("There is no token yet.");
    }

    return connection.token;
}

export function updateState(state: ConnectionState) {
    // TODO: Notify state listeners
    connection.state = state;
}
