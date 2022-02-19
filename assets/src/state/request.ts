import { writable, Writable } from "svelte/store";
import { RookType } from "../models/rook_type";
import { Connection } from "../network/channel/connection";
import type {
    RequestAcceptedMessage,
    RequestAcknowledgedMessage,
    ShareCancelledMessage,
    ShareIceCandidateMessage,
} from "../network/channel/messages/messages";
import { respondToOffer } from "../network/transfer/request_transfer";
import { addRemoteIceCandidate, Transfer } from "../network/transfer/transfer";
import { isClientRequest } from "./constant_state";
import b from "../utils/bind";

export enum RequestStateType {
    CONNECTING,

    WAITING_FOR_RESPONSE,

    IN_FLIGHT,
    DONE,

    DECLINED,
    SHARE_CANCELLED,
    NO_SUCH_SHARE,
}

type RequestState = {
    type: Writable<RequestStateType>;
    state:
        | Connecting
        | WaitingForResponse
        | Transferring
        | Done
        | Declined
        | ShareCancelled
        | NoSuchShare;
};

let request: RequestState | null = null;

export function initializeRequest() {
    if (!isClientRequest()) {
        throw new Error(
            "Tried to initialize request state on non-request client."
        );
    }

    if (request) {
        throw new Error("Request state already initialized.");
    }

    request = {
        type: writable(RequestStateType.CONNECTING),
        state: new Connecting(),
    };
}

export function getRequestState(): RequestState {
    if (!isClientRequest()) {
        throw new Error("Tried to access share state on non-share client.");
    }

    return request;
}

class Connecting {
    private connection: Connection;

    constructor() {
        this.connection = new Connection();
        this.connection.setChannelMessageHandler({
            request_acknowledged: b(this, this.onRequestAcknowledged),
        });

        this.connection.start(RookType.REQUEST);
    }

    private onRequestAcknowledged(m: RequestAcknowledgedMessage) {
        request.type.set(RequestStateType.WAITING_FOR_RESPONSE);
        request.state = new WaitingForResponse(this.connection);
    }
}

class WaitingForResponse {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;

        this.connection.setChannelMessageHandler({
            request_accepted: b(this, this.onRequestAccepted),
            share_cancelled: b(this, this.onShareCancelled),
            // TODO: request_declined
        });
    }

    private onRequestAccepted(m: RequestAcceptedMessage) {
        request.type.set(RequestStateType.IN_FLIGHT);
        request.state = new Transferring(this.connection, m);
    }

    private onShareCancelled(m: ShareCancelledMessage) {
        request.type.set(RequestStateType.SHARE_CANCELLED);
        request.state = null;
    }
}

class Transferring {
    private connection: Connection;
    private transfer: Transfer | null = null;
    private unaddedIceCandidates: RTCIceCandidateInit[] = [];

    constructor(connection: Connection, offer: RTCSessionDescriptionInit) {
        this.connection = connection;
        this.connection.setChannelMessageHandler({
            share_ice_candidate: b(this, this.onShareIceCandidate),
            // TODO: share_cancelled
        });

        const offerPromise = respondToOffer(
            this.connection,
            offer,
            b(this, this.onTransferComplete)
        );

        offerPromise.then(transfer => {
            for (const candidate of this.unaddedIceCandidates) {
                addRemoteIceCandidate(transfer, candidate);
            }
            this.unaddedIceCandidates = [];
        });
    }

    private onShareIceCandidate(m: ShareIceCandidateMessage) {
        if (!this.transfer) {
            this.unaddedIceCandidates.push(m.candidate);
        } else {
            addRemoteIceCandidate(this.transfer, m.candidate);
        }
    }

    private onTransferComplete() {
        request.type.set(RequestStateType.DONE);
        request.state = null;
    }
}

// Finished states.
type Done = null;
type Declined = null;
type ShareCancelled = null;
type NoSuchShare = null;
