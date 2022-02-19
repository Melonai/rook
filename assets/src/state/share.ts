import { get, Readable, writable, Writable } from "svelte/store";
import {
    IncomingRequest,
    IncomingRequestState,
    newIncomingRequest,
} from "../models/incoming_request";
import { RookType } from "../models/rook_type";
import { Connection } from "../network/channel/connection";
import type {
    NewRequestMessage,
    RequestCancelledMessage,
    RequestIceCandidateMessage,
    ShareAcceptedMessage,
} from "../network/channel/messages/messages";
import {
    addRemoteDescription,
    createTranferAndSendOffer,
} from "../network/transfer/share_transfer";
import { addRemoteIceCandidate } from "../network/transfer/transfer";
import { isClientShare } from "./constant_state";
import data from "./data";
import b from "../utils/bind";

export enum ShareStateType {
    CHOOSING_DATA,
    CONNECTING,
    SHARING,
}

type ShareState = {
    type: Writable<ShareStateType>;
    state: ChoosingData | Connecting | Sharing;
};

let share: ShareState | null = null;

export function initializeShare() {
    if (!isClientShare()) {
        throw new Error("Tried to initialize share state on non-share client.");
    }

    if (share) {
        throw new Error("Share state already initialized.");
    }

    share = {
        type: writable(ShareStateType.CHOOSING_DATA),
        state: new ChoosingData(),
    };
}

export function getShareState(): ShareState {
    if (!isClientShare()) {
        throw new Error("Tried to access share state on non-share client.");
    }

    return share;
}

export class ChoosingData {
    public submitData(d: string): void {
        data.set(d);

        share.type.set(ShareStateType.CONNECTING);
        share.state = new Connecting();
    }
}

export class Connecting {
    private connection: Connection;

    constructor() {
        this.connection = new Connection();
        this.connection.setChannelMessageHandler({});

        this.connection.start(RookType.SHARE).then(b(this, this.onConnect));
    }

    private onConnect() {
        share.type.set(ShareStateType.SHARING);
        share.state = new Sharing(this.connection);
    }
}

export class Sharing {
    private incomingRequests: Writable<{ [key: string]: IncomingRequest }> =
        writable({});

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
        this.connection.setChannelMessageHandler({
            new_request: b(this, this.onNewRequest),
            request_cancelled: b(this, this.onRequestCancelled),

            share_accepted: b(this, this.onShareAccepted),
            request_ice_candidate: b(this, this.onRequestIceCandidate),
        });
    }

    public getToken(): string {
        return this.connection.token;
    }

    public getRequests(): Readable<{ [key: string]: IncomingRequest }> {
        return this.incomingRequests;
    }

    public async acceptRequest(request: IncomingRequest) {
        request.state.set(IncomingRequestState.IN_FLIGHT);

        const transfer = await createTranferAndSendOffer(
            this.connection,
            request.info.token,
            () => {
                this.onRequestTransferComplete(request);
            }
        );
        request.transfer = transfer;
    }

    public async declineRequest(request: IncomingRequest) {
        // TODO: Implement.
        throw new Error("Declining requests is not implemented yet.");
    }

    private onNewRequest(m: NewRequestMessage) {
        const request = newIncomingRequest(m.token, m.ip, m.location, m.client);

        const mapping = {
            [m.token]: request,
        };

        // TODO: Check if the request is already in the list.

        this.incomingRequests.update(requests => {
            return {
                ...requests,
                ...mapping,
            };
        });
    }

    private onRequestCancelled(m: RequestCancelledMessage) {
        // TODO: Cancel ongoing share.

        this.incomingRequests.update(requests => {
            const newRequests = {
                ...requests,
            };
            // TODO: Check if the request is in the list.
            delete newRequests[m.token];
            return newRequests;
        });
    }

    private onShareAccepted(m: ShareAcceptedMessage) {
        // TODO: Check if the request is in the list.
        const request = get(this.incomingRequests)[m.token];
        addRemoteDescription(request.transfer, m);
    }

    private onRequestIceCandidate(m: RequestIceCandidateMessage) {
        const request = get(this.incomingRequests)[m.token];
        addRemoteIceCandidate(request.transfer, m.candidate);
    }

    private onRequestTransferComplete(request: IncomingRequest) {
        request.state.set(IncomingRequestState.DONE);
    }
}
