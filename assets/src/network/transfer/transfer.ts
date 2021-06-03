import { send } from "../channel/connection";

export enum TransferType {
    OFFER,
    ANSWER,
}

export type Transfer = {
    pc: RTCPeerConnection;
    channel: RTCDataChannel;
    type: TransferType;
};

export async function offer(request_token: string): Promise<Transfer> {
    const transfer = createTransfer(TransferType.OFFER);

    const offer = await transfer.pc.createOffer();
    transfer.pc.setLocalDescription(offer);

    // TODO: Start waiting for remote answer

    send("accept_request", {
        request: request_token,
        sdp: offer.sdp,
        type: offer.type,
    });

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

    send("accept_share", {
        sdp: offer.sdp,
        type: offer.type,
    });

    return transfer;
}

function createTransfer(type: TransferType): Transfer {
    const pc = new RTCPeerConnection(null);
    const channel = pc.createDataChannel("channel", {
        negotiated: true,
        id: 0,
    });

    return {
        pc,
        channel,
        type,
    };
}