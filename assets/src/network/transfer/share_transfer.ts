import { get } from "svelte/store";
import dataStore from "../../state/data";
import type { Connection } from "../channel/connection";
import type {
    RequestIceCandidateMessage,
    ShareAcceptedMessage,
} from "../channel/messages/messages";
import { createTransfer, addRemoteIceCandidate, Transfer, TransferState } from "./transfer";

export async function createTranferAndSendOffer(
    c: Connection,
    request_token: string,
    onComplete: () => void
): Promise<Transfer> {
    const transfer = createTransfer(c => onChannel(c, onComplete));

    const offer = await transfer.pc.createOffer();
    transfer.pc.setLocalDescription(offer);

    transfer.pc.onicecandidate = event => {
        const candidate = event.candidate;
        if (event.candidate !== null) {
            // TODO: Check whether transfer was cancelled and don't send if so.
            c.send("ice_candidate", { candidate, token: request_token });
        }
    };

    c.send("accept_request", {
        token: request_token,
        sdp: offer.sdp,
        type: offer.type,
    });

    return transfer;
}

export function addRemoteDescription(
    transfer: Transfer,
    session: RTCSessionDescriptionInit
) {
    const answerDescription = new RTCSessionDescription(session);
    transfer.pc.setRemoteDescription(answerDescription);
}

function onChannel(channel: RTCDataChannel, completeTransfer: () => void) {
    const data = get(dataStore).data;
    channel.send(data);
    // TODO: Add retransmission possibility in case of transfer failure?
    completeTransfer();
}
