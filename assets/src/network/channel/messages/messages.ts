export type AnyMessage = ShareMessage | RequestMessage;

export type EventName = AnyMessage["event_name"];
export type MessageForEvent<EN> = Extract<AnyMessage, { event_name: EN }>;

export type TokenizedMessage = {
    token: string;
} & AnyMessage;

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
