import { Writable, writable } from "svelte/store";
import type { IncomingRequest } from "../../models/incoming_request";
import type { OwnRequest } from "../../models/own_request";
import type { Unregister } from "../channel/messages/event_handler";
import type {
    RequestIceCandidateMessage,
    ShareIceCandidateMessage,
} from "../channel/messages/messages";

export enum TransferState {
    CONNECTING,
    TRANSFERRING,
    DONE,
}

export type Transfer = {
    pc: RTCPeerConnection;
    channel: RTCDataChannel;
    state: Writable<TransferState>;
};

const servers = {
    iceServers: [
        {
            urls: [
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
            ],
        },
    ],
    iceCandidatePoolSize: 10,
};

export function createTransfer(
    onChannel: (channel: RTCDataChannel, completeTransfer: () => void) => void
): Transfer {
    const pc = new RTCPeerConnection(servers);
    const channel = pc.createDataChannel("channel", {
        negotiated: true,
        id: 0,
    });

    const state = writable(TransferState.CONNECTING);

    const transfer = {
        pc,
        channel,
        state,
    };

    channel.onopen = () => {
        state.set(TransferState.TRANSFERRING);
        onChannel(channel, () => onTransferComplete(transfer));
    };

    return transfer;
}

export function bindTransfer(
    request: OwnRequest | IncomingRequest,
    transferPromise: Promise<Transfer>,
    completeTransfer: () => void
) {
    transferPromise.then(transfer => {
        request.transfer = transfer;

        const unsubsribe = transfer.state.subscribe(transferState => {
            if (transferState === TransferState.DONE) {
                unsubsribe();
                // Once the data has been transferred we can remove the transfer
                request.transfer = null;

                completeTransfer();
            }
        });
    });
}

export function onIncomingIceCandidate(
    transfer: Transfer,
    message: ShareIceCandidateMessage | RequestIceCandidateMessage
) {
    transfer.pc.addIceCandidate(message.candidate);
}

export function unregisterIceOnComplete(
    transfer: Transfer,
    unregister: Unregister
) {
    transfer.pc.onicegatheringstatechange = event => {
        const connection = event.target as any;
        if (connection.iceGatheringState === "complete") {
            unregister();
        }
    };
}

function onTransferComplete(transfer: Transfer) {
    transfer.state.set(TransferState.DONE);
    transfer.pc.close();
}
