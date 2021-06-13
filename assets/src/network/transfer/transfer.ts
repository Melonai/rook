import type { UnregisterHandler } from "../channel/messages/handler";
import type {
    RequestIceCandidateMessage,
    ShareIceCandidateMessage,
} from "../channel/messages/messages";

export enum TransferType {
    OFFER,
    ANSWER,
}

export type Transfer = {
    pc: RTCPeerConnection;
    channel: RTCDataChannel;
    type: TransferType;
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
    type: TransferType,
    onChannel: (channel: RTCDataChannel) => void
): Transfer {
    const pc = new RTCPeerConnection(servers);
    const channel = pc.createDataChannel("channel", {
        negotiated: true,
        id: 0,
    });

    channel.onopen = () => onChannel(channel);

    return {
        pc,
        channel,
        type,
    };
}

export function onIncomingIceCandidate(
    transfer: Transfer,
    message: ShareIceCandidateMessage | RequestIceCandidateMessage
) {
    transfer.pc.addIceCandidate(message.candidate);
}

export function unregisterIceOnComplete(
    transfer: Transfer,
    unregister: UnregisterHandler
) {
    transfer.pc.onicegatheringstatechange = event => {
        const connection = event.target as any;
        if (connection.iceGatheringState === "complete") {
            unregister();
        }
    };
}
