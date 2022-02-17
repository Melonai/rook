import { writable } from "svelte/store";

const createDataStore = () => {
    const { subscribe, update } = writable({ locked: false, data: null });

    return {
        subscribe,
        set: data => {
            update(state => {
                if (!state.locked) {
                    return { locked: true, data };
                } else {
                    console.error("Tried setting data after locking.");
                    return state;
                }
            });
        },
    };
};

export default createDataStore();
