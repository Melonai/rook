import { Channel, Push, Socket } from "phoenix";
import { get, Readable, writable, Writable } from "svelte/store";
import { RookType } from "../../models/rook_type";
import getShareToken from "../../utils/getShareToken";
import type { AnyMessage } from "./messages/messages";
import {
    MessageHandler,
    routeEventToHandler,
} from "./messages/message_handler";
import {
    connectSocket,
    fetchTokenFromSocket,
    joinRequestChannel,
    joinShareChannel,
} from "./socket";

export enum ConnectionState {
    CONNECTING_SOCKET,
    FETCHING_TOKEN,
    CONNECTING_CHANNEL,

    CONNECTED,
}

export class Connection {
    socket: Socket;
    channel: Channel | null;
    token: string | null;
    state: Writable<ConnectionState>;

    handler: MessageHandler<AnyMessage>;

    constructor() {
        this.socket = new Socket("/socket", {});
        this.channel = null;
        this.token = null;
        this.state = writable(ConnectionState.CONNECTING_SOCKET);
        this.handler = {};
    }

    async start(type: RookType) {
        // Connect to server.
        await connectSocket(this.socket);

        // Fetch token for connection.
        this.updateState(ConnectionState.FETCHING_TOKEN);
        this.token = await fetchTokenFromSocket(this.socket);

        // Connect to the correct channel.
        this.updateState(ConnectionState.CONNECTING_CHANNEL);
        switch (type) {
            case RookType.REQUEST:
                const requestChannel = await joinRequestChannel(
                    this.socket,
                    this.token,
                    getShareToken()
                );
                this.channel = requestChannel;

                break;
            case RookType.SHARE:
                const shareChannel = await joinShareChannel(
                    this.socket,
                    this.token
                );
                this.channel = shareChannel;

                break;
        }

        this.updateState(ConnectionState.CONNECTED);

        // Setup up event handler.
        this.channel.onMessage = (event, payload) => {
            console.log(event, payload);

            const payloadWithEvent = { ...payload, event_name: event };
            routeEventToHandler(event, payloadWithEvent, this.handler);
            return payload;
        };
    }

    send(event: string, data: any): Push {
        if (get(this.getState()) !== ConnectionState.CONNECTED) {
            throw new Error("There is no connection yet.");
        }

        return this.channel.push(event, data);
    }

    getOwnToken(): string {
        if (get(this.getState()) <= ConnectionState.FETCHING_TOKEN) {
            throw new Error("There is no token yet.");
        }

        return this.token;
    }

    getState(): Writable<ConnectionState> {
        return this.state;
    }

    updateState(state: ConnectionState) {
        this.state.set(state);
    }

    setChannelMessageHandler(handler: MessageHandler<AnyMessage>) {
        this.handler = handler;
    }
}
