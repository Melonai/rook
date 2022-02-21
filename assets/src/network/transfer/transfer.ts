import { Writable, writable } from "svelte/store";
import { toast, ToastType } from "../../state/toast";

export enum TransferState {
    CONNECTING,
    TRANSFERRING,
    DONE,
    FAILED,
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

    pc.addEventListener("iceconnectionstatechange", (e: any) => {
        if (pc.iceConnectionState === "failed") {
            toast({
                type: ToastType.ERROR,
                title: "An error occurred!",
                // FIXME: Implement said fix!
                message: "ICE negotiation failed. A fix is in progress.",
            });
            transfer.state.set(TransferState.FAILED);
        }
    });

    return transfer;
}

export function addRemoteIceCandidate(
    transfer: Transfer,
    candidate: RTCIceCandidateInit
) {
    transfer.pc.addIceCandidate(candidate);
}

function onTransferComplete(transfer: Transfer) {
    transfer.state.set(TransferState.DONE);
    transfer.pc.close();
}
