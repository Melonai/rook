import RequestPage from "../components/RequestPage.svelte";
import { RookType } from "../models/rook_type";
import { setClientType } from "../state/constant_state";
import { initializeRequest } from "../state/request";

setClientType(RookType.REQUEST);
initializeRequest();

const app = new RequestPage({
    target: document.getElementById("app"),
    props: {},
});

export default app;
