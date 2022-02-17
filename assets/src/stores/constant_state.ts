// Cannot be changed after being set.

import { RookType } from "../models/rook_type";

let clientType: RookType = null;

export function setClientType(type: RookType) {
    if (clientType !== null) {
        clientType = type;
    } else {
        throw new Error("Tried changing client type after initialization.");
    }
}

export function isClientShare() {
    if (clientType === null) {
        throw new Error(
            "Tried accessing client type before initialization was completed."
        );
    }

    return clientType === RookType.SHARE;
}

export function isClientRequest() {
    if (clientType === null) {
        throw new Error(
            "Tried accessing client type before initialization was completed."
        );
    }

    return clientType === RookType.REQUEST;
}
