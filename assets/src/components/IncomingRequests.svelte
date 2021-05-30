<script lang="ts">
    import { getOwnToken, start, Type } from "../network/channel/connection";

    import requests from "../stores/requests";

    const startPromise = start(Type.SHARE);

    // TODO: Switch to store-based state updates.
</script>

{#await startPromise}
    <h3>Fetching token...</h3>
{:then}
    <h3>Your token is <b>{getOwnToken()}</b>.</h3>

    {#each $requests as request}
        <p>{JSON.stringify(request)}</p>
    {/each}
{/await}
