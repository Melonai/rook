import { writable } from "svelte/store";

const createRequestStore = () => {
    const { subscribe, update } = writable([]);

    return {
        subscribe,
        addRequest: request => update(state => [request, ...state]),
    };
};

export default createRequestStore();
