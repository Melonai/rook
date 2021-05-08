<script lang="ts">
    import { getToken, joinShareChannel } from "../network/socket";
    import requests from "../stores/requests";

    const startConnection = async () => {
        const token = await getToken();
        joinShareChannel(token);
        return token;
    };
</script>

{#await startConnection()}
    <h3>Fetching token...</h3>
{:then token}
    <h3>Your token is <b>{token}</b>.</h3>

    {#each $requests as request}
        <p>{JSON.stringify(request)}</p>
    {/each}
{/await}
