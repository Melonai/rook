import { writable } from "svelte/store";
import type { IncomingRequest } from "../models/incoming_request";

const createRequestStore = () => {
    const { subscribe, update } = writable<IncomingRequest[]>([]);

    return {
        subscribe,
        addRequest: (request: IncomingRequest) => update(state => [request, ...state]),
        removeRequest: (token: string) =>
            update(state =>
                state.filter(request => request.info.token !== token)
            ),
    };
};

export default createRequestStore();
