<script lang="ts">
    import data from "../state/data";
    import EyeOpenedIcon from "./icons/EyeOpenedIcon.svelte";
    import EyeClosedIcon from "./icons/EyeClosedIcon.svelte";
    import { isClientShare } from "../state/constant_state";

    let hidden = true;

    const eyeColor = isClientShare() ? "white" : "black";

    function toggle() {
        hidden = !hidden;
    }

    function hideText(text: string): string {
        return text
            .split("")
            .map(c => {
                if (c === "\n") {
                    return "\n";
                } else {
                    return "●";
                }
            })
            .join("");
    }
</script>

<div class="button-overlay">
    <button on:click={toggle} class="top-icon">
        {#if hidden}
            <EyeOpenedIcon color={eyeColor} />
        {:else}
            <EyeClosedIcon color={eyeColor} />
        {/if}
    </button>
    <div class="data-view">
        <div class="textbox">
            {hidden ? hideText($data.data) : $data.data}
        </div>
    </div>
</div>

<style>
    .button-overlay {
        position: relative;
    }

    .data-view {
        font-size: 14px;
        box-sizing: border-box;
        display: flex;
        align-items: flex-start;

        resize: vertical;

        overflow-y: auto;
        /* Overloads auto on Chrome and Opera */
        overflow-y: overlay;

        min-height: 40px;
        min-width: 300px;
        max-width: 500px;
        width: 100%;
        height: 100px;

        padding: 10px 30px 0 15px;
    }

    .data-view::-webkit-scrollbar {
        width: 5px;
        padding-right: 1px;
        border-radius: 5px;
    }

    .data-view::-webkit-scrollbar-thumb {
        background: #626262;
    }

    .data-view::-webkit-scrollbar-corner {
        background: transparent;
    }

    .data-view::-webkit-scrollbar-track {
        background: transparent;
    }

    .data-view::-webkit-resizer {
        background: transparent;
    }

    .top-icon {
        border: none;
        background: none;

        position: absolute;
        top: 10px;
        right: 10px;
        padding: 0;
    }

    .textbox {
        font-size: 14px;
        font-family: monospace;
        flex: 1;
        outline: none;
        border: none;
        resize: none;
        overflow: hidden;

        width: 100%;

        background-color: transparent;
        color: inherit;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style>
