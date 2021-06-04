import type { Channel } from "phoenix";
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

export type Handler<Message extends AnyMessage> = (
    message?: Message,
    unregister?: UnregisterHandler
) => void;

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

        unregister = makeDirectUnregister(directHandlers, handler);
    } else {
        const tokenHandler = eventHandler.tokenHandler;
        tokenHandler[token] = handler;

        unregister = makeTokenUnregister(tokenHandler, token);
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

        const tokenHandler = eventHandler.tokenHandler;
        const handler: Handler<Message> = tokenHandler[token];

        if (handler !== undefined) {
            handler(message, makeTokenUnregister(tokenHandler, token));
        }
    }

    const directHandlers = eventHandler.directHandlers;
    for (const handler of directHandlers) {
        handler(message, makeDirectUnregister(directHandlers, handler));
    }
}

function makeDirectUnregister<Message extends AnyMessage>(
    directHandlers: Handler<Message>[],
    handler: Handler<Message>
): UnregisterHandler {
    return () => {
        const index = directHandlers.findIndex(h => h === handler);
        directHandlers.splice(index, 1);
    };
}

function makeTokenUnregister<Message extends AnyMessage>(
    tokenHandler: TokenHandler<Message>,
    token: string
): UnregisterHandler {
    return () => {
        delete tokenHandler[token];
    };
}
