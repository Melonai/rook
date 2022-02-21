import RequestPage from "../components/RequestPage.svelte";
import { RookType } from "../models/rook_type";
import { setClientType } from "../state/constant_state";
import { initializeRequest } from "../state/request";
import { toast, ToastType } from "../state/toast";

window.addEventListener("load", () => {
    function onError(message: string) {
        toast({
            type: ToastType.ERROR,
            title: "An error occurred!",
            message: message,
        });
    }

    window.addEventListener("error", e => onError(e.message));
    window.addEventListener("unhandledrejection", e => {
        onError(e.reason.message ?? e.reason ?? "Unknown error");
    });
});

setClientType(RookType.REQUEST);
initializeRequest();

const app = new RequestPage({
    target: document.getElementById("app"),
    props: {},
});

export default app;
