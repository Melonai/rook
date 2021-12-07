import { Channel, Push, Socket } from "phoenix";
import { get, Readable, writable, Writable } from "svelte/store";
import {
    HandlerFn,
    EventHandler,
    registerHandlerForSpecificToken,
    UnregisterFn,
    registerHandler,
} from "./messages/event_handler";
import type { AnyMessage, TokenizedMessage } from "./messages/messages";
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
    state: Writable<ConnectionState>;
    handlers: EventHandler;
};

const connection: Connection = {
    socket: new Socket("/socket", {}),
    channel: null,
    token: null,
    state: writable(ConnectionState.CONNECTING_SOCKET),
    handlers: {},
};

export async function start() {
    await connectSocket(connection.socket);

    updateState(ConnectionState.FETCHING_TOKEN);
    connection.token = await fetchToken(connection.socket);

    return connection;
}

export function send(event: string, data: any): Push {
    if (getState() !== ConnectionState.CONNECTED) {
        throw new Error("There is no connection yet.");
    }

    return connection.channel.push(event, data);
}

export function onWithToken<M extends TokenizedMessage>(
    event: M["event_name"],
    token: string | null,
    handler: HandlerFn<M>
): UnregisterFn {
    return registerHandlerForSpecificToken(
        connection.handlers,
        connection.channel,
        event,
        token,
        handler
    );
}

export function on<M extends AnyMessage>(
    event: M["event_name"],
    handler: HandlerFn<M>
): UnregisterFn {
    return registerHandler(
        connection.handlers,
        connection.channel,
        event,
        handler
    );
}

export function getOwnToken(): string {
    if (getState() <= ConnectionState.FETCHING_TOKEN) {
        throw new Error("There is no token yet.");
    }

    return connection.token;
}

export function getState(): ConnectionState {
    return get(connection.state);
}

export function updateState(state: ConnectionState) {
    connection.state.set(state);
}

export function getStateStore(): Readable<ConnectionState> {
    return connection.state;
}
