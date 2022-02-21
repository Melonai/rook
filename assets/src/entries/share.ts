import SharePage from "../components/SharePage.svelte";
import { RookType } from "../models/rook_type";
import { setClientType } from "../state/constant_state";
import { initializeShare } from "../state/share";
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

setClientType(RookType.SHARE);
initializeShare();

const app = new SharePage({
    target: document.getElementById("app"),
    props: {},
});

export default app;
