export type AnyMessage = ShareMessage | RequestMessage;

// Messages for the sharer

export type ShareMessage =
    | NewRequestMessage
    | RequestCancelledMessage
    | ShareAcceptedMessage
    | RequestIceCandidateMessage;

export type NewRequestMessage = {
    token: string;
};

export type RequestCancelledMessage = {
    token: string;
};

export type ShareAcceptedMessage = {
    token: string;
    sdp: string;
    type: RTCSdpType;
};

export type RequestIceCandidateMessage = {
    token: string;
    candidate: RTCIceCandidateInit;
};

// Messages for the requestor

export type RequestMessage =
    | RequestAcknowledgedMessage
    | RequestAcceptedMessage
    | ShareCancelledMessage
    | ShareIceCandidateMessage;

export type RequestAcknowledgedMessage = {};

export type RequestAcceptedMessage = {
    sdp: string;
    type: RTCSdpType;
};

export type ShareCancelledMessage = {};

export type ShareIceCandidateMessage = {
    candidate: RTCIceCandidateInit;
};
