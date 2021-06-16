<script lang="ts">
    import requests from "../../stores/requests";
    import Request from "./Request.svelte";
</script>

<!-- <script lang="ts">
    import { getOwnToken, start } from "../../network/channel/connection";
    import { startShare } from "../../network/channel/share";

    import requests from "../../stores/requests";
    import Request from "./Request.svelte";

    const startPromise = start().then(startShare);

    // TODO: Switch to store-based state updates.
</script>

{#await startPromise}
    <h3>Fetching token...</h3>
{:then}
    <h3>Your token is <b>{getOwnToken()}</b>.</h3> -->

{#each $requests as request}
    <Request token={request} />
{/each}
<!-- {/await} -->
