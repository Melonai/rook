import { writable } from "svelte/store";

const createRequestStore = () => {
    const { subscribe, update } = writable<string[]>([]);

    return {
        subscribe,
        addRequest: request => update(state => [request, ...state]),
        removeRequest: request =>
            update(state => state.filter(r => r !== request)),
    };
};

export default createRequestStore();
