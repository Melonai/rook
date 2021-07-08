import { bindTransfer, Transfer } from "../network/transfer/transfer";
import { writable, Writable } from "svelte/store";
import { createAnswerTransfer } from "../network/transfer/request_transfer";

// Represents the current progress of the request
export enum OwnRequestState {
    PENDING,
    ACKNOWLEDGED,

    IN_FLIGHT,
    DONE,

    DECLINED,
    SHARE_CANCELLED,
    NO_SUCH_SHARE,
}

export type OwnRequest = {
    // Transfer is null while request isn't IN_FLIGHT
    transfer: Transfer | null;
    state: Writable<OwnRequestState>;
};

export function initializeRequest(): OwnRequest {
    return {
        transfer: null,
        state: writable(OwnRequestState.PENDING),
    };
}

export function requestAccepted(
    request: OwnRequest,
    description: RTCSessionDescriptionInit
) {
    request.state.set(OwnRequestState.IN_FLIGHT);

    bindTransfer(request, createAnswerTransfer(description), () =>
        request.state.set(OwnRequestState.DONE)
    );
}
