import type { Channel } from "phoenix";
import type {
    AnyMessage,
    EventName,
    MessageForEvent,
    TokenizedMessage,
} from "./messages";

// The single handler for all events, which is used to dispatch to the correct
// handler for each event and token.
// Every event can only have either one single handler, or multiple handlers for different tokens.
export type EventHandler = {
    [EN in EventName]?: MessageHandler<MessageForEvent<EN>>;
};

// A handler for a specific event and message.
// A message handler can either be a single handler or can have multiple handlers for different tokens
type MessageHandler<M extends AnyMessage> =
    // A single handler
    | { type: "single"; handler: Handler<M> }
    // A group of handlers for different tokens
    // Can only be used for messages which have a "token" field.
    | (M extends TokenizedMessage
          ? {
                type: "token";
                handler: TokenHandler<M>;
            }
          : never);

// A map of token to handler for a specific event.
export type TokenHandler<M extends TokenizedMessage> = Map<string, Handler<M>>;

// A function which handles a message for a specific event.
export type Handler<M extends AnyMessage> = (message?: M) => void;

// A function that unregisters a single event handler.
export type Unregister = () => void;

// Adds a single handler for a specific event.
export function registerHandler<M extends AnyMessage>(
    eventHandler: EventHandler,
    channel: Channel,
    event: M["event_name"],
    handler: Handler<M>
) {
    const messageHandler: MessageHandler<M> = {
        type: "single",
        handler,
    };

    let unregisterChannelEvent: Unregister | null = null;
    if (typeof eventHandler[event] === "undefined") {
        // Register a new event handler, since this is the first handler for this event
        unregisterChannelEvent = registerNewEvent<M>(
            channel,
            messageHandler,
            event
        );
    } else {
        throw new Error("Event already has a handler attached to it.");
    }

    // TODO: Check if we there is a possibility for TS to accept this.
    // Technically this should work, because TS is afraid of the generic type parameter
    // not matching the message type of the handler. But it should match, since
    // the handler should accept only the exact message type from which the event_name was derived.
    // @ts-ignore
    eventHandler[event] = messageHandler;

    // This could cause problems if we would allow to redefine the handler,
    // as that would cause the Unsubscribe function to no longer apply to this specific handler,
    // but as we throw an error on redefinition, this should be fine.
    return () => {
        delete eventHandler[event];

        // If we registered a new event on the channel, we need to unregister it
        if (unregisterChannelEvent !== null) {
            unregisterChannelEvent();
        }
    };
}

export function registerHandlerForSpecificToken<M extends TokenizedMessage>(
    eventHandler: EventHandler,
    channel: Channel,
    event: M["event_name"],
    token: string,
    handler: Handler<M>
): Unregister {
    const messageHandler = eventHandler[event];

    if (typeof messageHandler === "undefined") {
        // TODO: Same as above, this should probably be valid.
        // @ts-ignore
        eventHandler[event] = {
            type: "token",
            handler: new Map<string, Handler<M>>(),
        };
        // @ts-ignore
        registerNewEvent<M>(channel, eventHandler[event], event);
    } else if (
        messageHandler.type === "token" &&
        messageHandler.handler.size === 0
    ) {
        // If there is already a token handler with no token, we need to register the event again
        // @ts-ignore
        registerNewEvent<M>(channel, messageHandler, event);
    } else if (messageHandler.type === "single") {
        throw new Error("Event already has a handler attached to it.");
    }

    // @ts-ignore This shoudl be valid, as we derive the event name from the message type.
    const tokenHandler: TokenHandler<M> = eventHandler[event].handler;
    tokenHandler.set(token, handler);

    return () => {
        // Unregister the handler for this specific token
        tokenHandler.delete(token);
        // If there are no more handlers for this event, we can unregister the event
        if (tokenHandler.size === 0) {
            // We should technically use the ref here, but we don't yet have a way to get it, as the event
            // could have been registered outside of this function call.
            channel.off(event);
        }
    };
}

// Adds a callback for a new event
function registerNewEvent<M extends AnyMessage>(
    channel: Channel,
    messageHandler: MessageHandler<M>,
    event: M["event_name"]
): Unregister {
    const callback = (data: M) => {
        // Add event_name to message, so the type definitions match
        const message = { event_name: event, ...data };
        onEvent<M>(messageHandler, message);
    };

    const ref = channel.on(event, callback);

    return () => channel.off(event, ref);
}

function onEvent<M extends AnyMessage>(
    messageHandler: MessageHandler<M>,
    message: M
) {
    if (messageHandler.type === "token") {
        const token: string = message["token"];

        const handler = messageHandler.handler.get(token);

        if (typeof handler !== "undefined") {
            (handler as Handler<M>)(message);
        } else {
            console.warn(`Received message for unknown token: ${token}`);
        }
    } else {
        messageHandler.handler(message);
    }
}
