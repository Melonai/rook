import { get } from "svelte/store";
import dataStore from "../../stores/data";
import { onWithToken, send } from "../channel/connection";
import type { UnregisterHandler } from "../channel/messages/handler";
import type {
    RequestIceCandidateMessage,
    ShareAcceptedMessage,
} from "../channel/messages/messages";
import {
    createTransfer,
    onIncomingIceCandidate,
    Transfer,
    TransferType,
    unregisterIceOnComplete,
} from "./transfer";

export async function offer(request_token: string): Promise<Transfer> {
    const transfer = createTransfer(TransferType.OFFER, onChannel);

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

function onShareAccepted(
    transfer: Transfer,
    message: ShareAcceptedMessage,
    unregister: UnregisterHandler
) {
    const token = message.token;

    const answerDescription = new RTCSessionDescription(message);
    transfer.pc.setRemoteDescription(answerDescription);

    const unregisterIce = onWithToken(
        "ice_candidate",
        token,
        (message: RequestIceCandidateMessage) =>
            onIncomingIceCandidate(transfer, message)
    );

    unregisterIceOnComplete(transfer, unregisterIce);

    unregister();
}

function onChannel(channel: RTCDataChannel) {
    const data = get(dataStore).data;
    channel.send(data);
}