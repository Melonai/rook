import { bindTransfer, Transfer } from "../network/transfer/transfer";
import { Writable, writable } from "svelte/store";
import { createOfferTransfer } from "../network/transfer/share_transfer";

// Represents the current progress of every request
export enum IncomingRequestState {
    // Request was neither accepted nor declined yet
    WAITING,
    // Data is being transferred, more precise data
    // is available in the corresponding Transfer object
    IN_FLIGHT,
    // Requestor has received all data
    DONE,
    // Request was declined
    DECLINED,
}

// Identifying information about the requestor
export type IncomingRequestInfo = {
    token: string;
};

// The model for a request received by a sharer
// The state marks changes in the progression of the request lifecycle and can be subscribed to
export type IncomingRequest = {
    // Transfer is null while request isn't IN_FLIGHT
    transfer: Transfer | null;
    info: IncomingRequestInfo;
    state: Writable<IncomingRequestState>;
};

// Create a model for a new incoming request
export function newIncomingRequest(token: string): IncomingRequest {
    const info = {
        token,
    };

    return {
        transfer: null,
        info,
        // Each request starts out as just received and waiting for an answer
        state: writable(IncomingRequestState.WAITING),
    };
}

// Starts the transfer of data from the sharer to the requestor
export function acceptIncomingRequest(request: IncomingRequest) {
    request.state.set(IncomingRequestState.IN_FLIGHT);

    bindTransfer(request, createOfferTransfer(request.info.token), () =>
        request.state.set(IncomingRequestState.DONE)
    );
}

export function declineIncomingRequest(request: IncomingRequest) {
    // TODO
}
