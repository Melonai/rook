import data from "../../stores/data";
import { on, send } from "../channel/connection";
import type { ShareIceCandidateMessage } from "../channel/messages/messages";
import {
    createTransfer,
    onIncomingIceCandidate,
    Transfer,
    unregisterIceOnComplete,
} from "./transfer";

export async function createAnswerTransfer(
    offer: RTCSessionDescriptionInit
): Promise<Transfer> {
    const transfer = createTransfer(onChannel);

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
        "share_ice_candidate",
        (message: ShareIceCandidateMessage) =>
            onIncomingIceCandidate(transfer, message)
    );

    unregisterIceOnComplete(transfer, unregisterIce);

    send("accept_share", {
        sdp: answer.sdp,
        type: answer.type,
    });

    return transfer;
}

function onChannel(channel: RTCDataChannel, completeTransfer: () => void) {
    channel.onmessage = event => {
        data.set(event.data);
        // TODO: Disconnect from channel
        completeTransfer();
    };
}
