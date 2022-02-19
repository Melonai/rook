export const eventNames = [
    "new_request",
    "request_cancelled",
    "share_accepted",
    "request_ice_candidate",

    "request_acknowledged",
    "request_accepted",
    "share_cancelled",
    "share_ice_candidate",
] as const;

export type EventName = typeof eventNames[any];

export type AnyMessage = (ShareMessage | RequestMessage) & {
    event_name: EventName;
};

// Messages for the sharer

export type ShareMessage =
    | NewRequestMessage
    | RequestCancelledMessage
    | ShareAcceptedMessage
    | RequestIceCandidateMessage;

export type NewRequestMessage = {
    event_name: "new_request";
    ip: string;
    location: string;
    client: string;
    token: string;
};

export type RequestCancelledMessage = {
    event_name: "request_cancelled";
    token: string;
};

export type ShareAcceptedMessage = {
    event_name: "share_accepted";
    token: string;
    sdp: string;
    type: RTCSdpType;
};

export type RequestIceCandidateMessage = {
    event_name: "request_ice_candidate";
    token: string;
    candidate: RTCIceCandidateInit;
};

// Messages for the requestor

export type RequestMessage =
    | RequestAcknowledgedMessage
    | RequestAcceptedMessage
    | ShareCancelledMessage
    | ShareIceCandidateMessage;

export type RequestAcknowledgedMessage = {
    event_name: "request_acknowledged";
};

export type RequestAcceptedMessage = {
    event_name: "request_accepted";
    sdp: string;
    type: RTCSdpType;
};

export type ShareCancelledMessage = {
    event_name: "share_cancelled";
};

export type ShareIceCandidateMessage = {
    event_name: "share_ice_candidate";
    candidate: RTCIceCandidateInit;
};
