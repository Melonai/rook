export type AnyMessage = ShareMessage | RequestMessage;

// Messages for the sharer

export type ShareMessage =
    | NewRequestMessage
    | RequestCancelledMessage
    | AcceptShareMessage;

export type NewRequestMessage = {
    token: string;
};

export type RequestCancelledMessage = {
    token: string;
};

export type AcceptShareMessage = {
    token: string;
    sdp: string;
    type: string;
};

// Messages for the requestor

export type RequestMessage = RequestAcknowledgedMessage | ShareCancelledMessage;

export type RequestAcknowledgedMessage = {};

export type ShareCancelledMessage = {};
