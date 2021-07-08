<script lang="ts">
    import {
        ConnectionState,
        getOwnToken,
        getStateStore,
    } from "../../network/channel/connection";
    import data from "../../stores/data";
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
        <!-- TODO: Display actual data. -->
        <div class="data">••••••••••••••••••••••••••••••</div>
    {:else}
        <p>Connecting to signaling server...</p>
    {/if}
{/if}

<style>
    span {
        color: white;
    }

    .data {
        font-size: 14px;
        width: 100%;
        background-color: white;
        color: black;
        padding: 10px 20px;
        box-sizing: border-box;
    }
</style>
