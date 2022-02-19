import type { Transfer } from "../network/transfer/transfer";
import { Writable, writable } from "svelte/store";

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

    ip: string;
    location: string;
    client: string;

    receivedAt: Date;
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
export function newIncomingRequest(
    token: string,
    ip: string,
    location: string,
    client: string
): IncomingRequest {
    const info = {
        token,
        ip,
        location,
        client,

        receivedAt: new Date(),
    };

    return {
        transfer: null,
        info,
        // Each request starts out as just received and waiting for an answer
        state: writable(IncomingRequestState.WAITING),
    };
}
