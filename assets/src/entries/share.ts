import SharePage from "../components/SharePage.svelte";
import { RookType } from "../models/rook_type";
import { setClientType } from "../state/constant_state";

setClientType(RookType.SHARE);

const app = new SharePage({
    target: document.getElementById("app"),
    props: {},
});

export default app;
