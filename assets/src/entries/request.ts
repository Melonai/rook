import Request from "../components/Request.svelte";

const app = new Request({
    target: document.getElementById("app"),
    props: {},
});

export default app;
