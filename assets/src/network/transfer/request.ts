import { on, send } from "../channel/connection";
import type { RequestIceCandidateMessage } from "../channel/messages/messages";
import {
    createTransfer,
    onIncomingIceCandidate,
    Transfer,
    TransferType,
    unregisterIceOnComplete,
} from "./transfer";

export async function answer(
    offer: RTCSessionDescriptionInit
): Promise<Transfer> {
    const transfer = createTransfer(TransferType.ANSWER, onChannel);

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

    const unregisterIce = on(
        "ice_candidate",
        (message: RequestIceCandidateMessage) =>
            onIncomingIceCandidate(transfer, message)
    );

    unregisterIceOnComplete(transfer, unregisterIce);

    send("accept_share", {
        sdp: answer.sdp,
        type: answer.type,
    });

    return transfer;
}

function onChannel(channel: RTCDataChannel) {
    channel.onmessage = event => {
        console.log(event.data)
    }
}
