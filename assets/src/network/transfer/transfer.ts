import { onWithToken, send } from "../channel/connection";
import type { UnregisterHandler } from "../channel/messages/handler";
import type {
    ShareAcceptedMessage,
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

export async function offer(request_token: string): Promise<Transfer> {
    const transfer = createTransfer(TransferType.OFFER);

    const offer = await transfer.pc.createOffer();
    transfer.pc.setLocalDescription(offer);

    transfer.pc.onicecandidate = event => {
        const candidate = event.candidate;
        if (event.candidate !== null) {
            send("ice_candidate", { candidate, token: request_token });
        }
    };

    send("accept_request", {
        token: request_token,
        sdp: offer.sdp,
        type: offer.type,
    });

    onWithToken(
        "share_accepted",
        request_token,
        (message: ShareAcceptedMessage, unregister) =>
            onShareAccepted(transfer, message, unregister)
    );

    return transfer;
}

export async function answer(
    offer: RTCSessionDescriptionInit
): Promise<Transfer> {
    const transfer = createTransfer(TransferType.ANSWER);

    const offerDescription = new RTCSessionDescription(offer);
    transfer.pc.setRemoteDescription(offerDescription);

    const answer = await transfer.pc.createAnswer();
    transfer.pc.setLocalDescription(answer);

    transfer.pc.onicecandidate = event => {
        const candidate = event.candidate;
        if (event.candidate !== null) {
            send("ice_candidate", { candidate });
        }
    };

    send("accept_share", {
        sdp: offer.sdp,
        type: offer.type,
    });

    return transfer;
}

function createTransfer(type: TransferType): Transfer {
    const pc = new RTCPeerConnection(servers);
    const channel = pc.createDataChannel("channel", {
        negotiated: true,
        id: 0,
    });

    channel.onopen = e => console.log("ooooyeeee");

    return {
        pc,
        channel,
        type,
    };
}

function onShareAccepted(
    transfer: Transfer,
    message: ShareAcceptedMessage,
    unregister: UnregisterHandler
) {
    const token = message.token;
    transfer.pc.setRemoteDescription(message);

    const unregisterIce = onWithToken(
        "ice_candidate",
        token,
        (message: RequestIceCandidateMessage) =>
            onIncomingIceCandidate(transfer, message)
    );

    transfer.pc.onicegatheringstatechange = event => {
        const connection = event.target as any;
        console.log(connection.iceGatheringState);
        if (connection.iceGatheringState === "complete") {
            unregisterIce();
        }
    };

    unregister();
}

function onIncomingIceCandidate(
    transfer: Transfer,
    message: ShareIceCandidateMessage | RequestIceCandidateMessage
) {
    transfer.pc.addIceCandidate(message.candidate);
}
