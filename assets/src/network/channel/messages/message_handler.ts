import type { AnyMessage, RequestMessage, ShareMessage } from "./messages";

export type HandlerFn<Message> = (message: Message) => void;

export type MessageHandler<Messages extends AnyMessage> = {
    [M in Messages as M["event_name"]]?: HandlerFn<M>;
};

export type RequestMessageHandler = MessageHandler<RequestMessage>;
export type ShareMessageHandler = MessageHandler<ShareMessage>;

const defaultHandlerFn: HandlerFn<AnyMessage> = m => {
    console.error(
        `Received unknown event "${m.event_name}": ${JSON.stringify(m)}`
    );
};

export function routeEventToHandler(
    event: string,
    message: any,
    handlers: MessageHandler<AnyMessage>
): void {
    const handler = handlers[event] || defaultHandlerFn;
    handler(message);
}
