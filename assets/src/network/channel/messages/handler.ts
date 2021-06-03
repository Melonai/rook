import { getChannel } from "../connection";
import type { AnyMessage } from "./messages";

export type Handlers = {
    [event: string]: EventHandler<unknown>;
};

type EventHandler<Message extends AnyMessage> = {
    tokenHandler: TokenHandler<Message>;
    directHandlers: Handler<Message>[];
};

export type TokenHandler<Message extends AnyMessage> = {
    [token: string]: Handler<Message>;
};

export type Handler<Message extends AnyMessage> = (message?: Message) => void;

export type UnregisterHandler = () => void;

export function registerTokenHandler<Message extends AnyMessage>(
    handlers: Handlers,
    channel: Channel,
    event: string,
    token: string | null,
    handler: Handler<Message>
): UnregisterHandler {
    let eventHandler = handlers[event];

    // If this event did not yet have any handlers registered we have to register it
    if (eventHandler === undefined) {
        eventHandler = {
            tokenHandler: {},
            directHandlers: [],
        };

        handlers[event] = eventHandler;

        registerNewEvent<Message>(channel, eventHandler, event);
    }

    let unregister: UnregisterHandler;

    if (token === null) {
        const directHandlers = eventHandler.directHandlers;
        directHandlers.push(handler);

        unregister = () => {
            const index = directHandlers.findIndex(h => h === handler);
            directHandlers.splice(index, 1);
        };
    } else {
        const tokenHandler = eventHandler.tokenHandler;
        tokenHandler[token] = handler;

        unregister = () => {
            delete tokenHandler[token];
        };
    }

    return unregister;
}

function registerNewEvent<Message extends AnyMessage>(
    channel: Channel,
    eventHandler: EventHandler<Message>,
    event: string
) {
    const callback = (data: Message) => {
        handleEvent<Message>(eventHandler, data);
    };

    channel.on(event, callback);
}

function handleEvent<Message extends AnyMessage>(
    eventHandler: EventHandler<Message>,
    message: Message
) {
    if (message["token"] !== undefined) {
        const token = message["token"];

        const handler: Handler<Message> = eventHandler.tokenHandler[token];

        if (handler === undefined) {
            throw new Error("Received message for an unknown token.");
        }

        handler(message);
    }

    for (const handler of eventHandler.directHandlers) {
        handler(message);
    }
}
