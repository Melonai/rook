<script lang="ts">
    import { getShareState, ShareStateType, Sharing } from "../../state/share";
    import DataSelector from "./selector/DataSelector.svelte";
    import DataView from "../DataView.svelte";
    import ClipboardIcon from "../icons/ClipboardIcon.svelte";
    import copy from "../../utils/copy";
    import { toast, ToastType } from "../../state/toast";

    const state = getShareState().type;

    function token() {
        const sharing = getShareState().state as Sharing;
        return sharing.getToken();
    }

    function copyUrl() {
        const url = `https://rook.to/${token()}`;
        copy(url).then(() => {
            toast({
                title: "Copied to clipboard!",
                message: url,
                type: ToastType.INFO,
            });
        });
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
        <div>
            Your share is available under:
            <div class="url-view">
                <span>rook.to/<span class="highlight">{token()}</span></span>
                <button class="copy-button" on:click={copyUrl}>
                    <ClipboardIcon color="white" />
                </button>
            </div>
        </div>
        <DataView />
    {/if}
{/if}

<style>
    h1 {
        margin-top: 0;
    }

    div {
        color: #626262;
    }

    .highlight {
        color: white;
    }

    .url-view {
        color: #626262;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30px;
    }

    .copy-button {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        padding-right: 9px;
    }
</style>
