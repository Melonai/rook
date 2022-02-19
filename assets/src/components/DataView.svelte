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

<div class="data-view">
    <div class="textbox">
        {hidden ? hideText($data.data) : $data.data}
    </div>
    <button on:click={toggle} class="icon">
        {#if hidden}
            <EyeOpenedIcon color={eyeColor} />
        {:else}
            <EyeClosedIcon color={eyeColor} />
        {/if}
    </button>
</div>

<style>
    .data-view {
        font-size: 14px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: flex-start;

        resize: both;
        overflow: scroll;
        min-height: 40px;
        min-width: 300px;
        max-width: 500px;

        height: 100px;

        padding: 10px 0 0 14px;

        scrollbar-color: #626262 transparent;
    }

    .icon {
        border: none;
        background: none;

        position: sticky;
        top: 0;
        right: 0;
        padding-right: 0;
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
