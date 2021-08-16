<script lang="ts">
    import {
        ConnectionState,
        getOwnToken,
        getStateStore,
    } from "../../network/channel/connection";
    import data from "../../stores/data";
    import DataView from "../DataView.svelte";
    import DataSelector from "./DataSelector.svelte";

    let connection = getStateStore();
</script>

{#if !$data.locked}
    <h1>What do you want to share?</h1>
    <DataSelector />
{:else}
    <h1>
        You are <br />
        sharing <b>a text.</b>
    </h1>
    {#if $connection === ConnectionState.CONNECTED}
        <p>
            Your share is available under: <br />
            rook.rnrd.eu/<span>{getOwnToken()}</span>
        </p>
        <DataView />
    {:else}
        <p>Connecting to signaling server...</p>
    {/if}
{/if}

<style>
    span {
        color: white;
    }
</style>
