<script lang="ts">
    import data from "../state/data";
    import EyeOpenedIcon from "./icons/EyeOpenedIcon.svelte";
    import EyeClosedIcon from "./icons/EyeClosedIcon.svelte";

    let hidden = true;

    function toggle() {
        hidden = !hidden;
    }
</script>

<div class="data-view">
    <input type={hidden ? "password" : "text"} value={$data.data} readonly />
    <button on:click={toggle} class="icon">
        {#if hidden}
            <EyeOpenedIcon color="black" />
        {:else}
            <EyeClosedIcon color="black" />
        {/if}
    </button>
</div>

<style>
    .data-view {
        font-size: 14px;
        width: 100%;
        box-sizing: border-box;
        padding: 10px 20px;
        display: flex;
        align-items: center;
    }

    .icon {
        border: none;
        background: none;
        display: flex;
        align-items: center;
    }

    input {
        flex: 1;
        outline: none;
        border: none;
        padding: 0;
    }
</style>
