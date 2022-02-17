import RequestPage from "../components/RequestPage.svelte";
import { RookType } from "../models/rook_type";
import { setClientType } from "../stores/constant_state";

setClientType(RookType.REQUEST);

const app = new RequestPage({
    target: document.getElementById("app"),
    props: {},
});

export default app;
