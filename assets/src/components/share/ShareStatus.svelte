<script lang="ts">
    import { getShareState, ShareStateType, Sharing } from "../../state/share";
    import DataSelector from "./selector/DataSelector.svelte";
    import DataView from "../DataView.svelte";

    const state = getShareState().type;

    function token() {
        const sharing = getShareState().state as Sharing;
        return sharing.getToken();
    }
</script>

{#if $state == ShareStateType.CHOOSING_DATA}
    <h1>What do you want to share?</h1>
    <DataSelector />
{:else}
    <h1>
        You are <br />
        sharing <b>a text.</b>
    </h1>
    {#if $state === ShareStateType.CONNECTING}
        <p>Connecting to signaling server...</p>
    {:else}
        <p>
            Your share is available under: <br />
            rook.to/<span>{token()}</span>
        </p>
        <DataView />
    {/if}
{/if}

<style>
    h1 {
        margin-top: 0;
    }

    span {
        color: white;
    }
</style>
