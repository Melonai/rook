import data from "../../state/data";
import type { Connection } from "../channel/connection";
import { createTransfer, Transfer } from "./transfer";

export async function respondToOffer(
    c: Connection,
    offer: RTCSessionDescriptionInit,
    onComplete: () => void
): Promise<Transfer> {
    const transfer = createTransfer(c => onChannel(c, onComplete));

    const offerDescription = new RTCSessionDescription(offer);
    transfer.pc.setRemoteDescription(offerDescription);

    const answer = await transfer.pc.createAnswer();
    transfer.pc.setLocalDescription(answer);

    transfer.pc.onicecandidate = event => {
        const candidate = event.candidate;
        if (event.candidate !== null) {
            // TODO: Check whether transfer was cancelled
            c.send("ice_candidate", { candidate });
        }
    };

    c.send("accept_share", {
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
