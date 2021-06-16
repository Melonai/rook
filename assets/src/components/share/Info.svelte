<script lang="ts">
    import {
        ConnectionState,
        getOwnToken,
        getStateStore,
    } from "../../network/channel/connection";
    import data from "../../stores/data";
    import Selector from "./Selector.svelte";

    let connection = getStateStore();
</script>

<div class="info">
    {#if !$data.locked}
        <h1>What do you want to share?</h1>
        <Selector />
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
</div>

<style>
    h1 {
        font-size: 35px;
        color: white;
        font-weight: 400;
    }

    p {
        color: #626262;
        font-size: 16px;
        margin-bottom: 30px;
    }

    span {
        color: white;
    }

    .info {
        width: 315px;
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
