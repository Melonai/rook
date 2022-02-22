<script lang="ts">
    import { dismissToast, toasts, ToastType } from "../state/toast";
    import { scale } from "svelte/transition";
    import CloseIcon from "./icons/CloseIcon.svelte";
    import FlashIcon from "./icons/FlashIcon.svelte";
    import LightbulbIcon from "./icons/LightbulbIcon.svelte";
    import { isClientShare } from "../state/constant_state";

    const iconColor = isClientShare() ? "white" : "black";

    function trim(str: string) {
        return str.slice(0, 100) + (str.length > 100 ? "..." : "");
    }
</script>

<div class="toasts">
    {#each $toasts as toast (toast.id)}
        <ul class="toast" in:scale out:scale>
            <div class="button" on:click={() => dismissToast(toast)}>
                <CloseIcon color={iconColor} />
            </div>

            <li>
                {#if toast.type === ToastType.INFO}
                    <LightbulbIcon color={iconColor} />
                {:else}
                    <FlashIcon color={iconColor} />
                {/if}
            </li>

            {#if toast.title}
                <li class="title">{toast.title}</li>
            {/if}

            <li class="message">{trim(toast.message)}</li>
        </ul>
    {/each}
</div>

<style>
    .toasts {
        position: fixed;
        bottom: 0;
        display: flex;
        align-items: center;
        width: 100%;
        z-index: 1;
        flex-direction: column-reverse;
    }

    .toast {
        width: 300px;
        border: solid 1px #626262;
        padding: 17px 20px;
        font-size: 12px;
        line-height: 1.5rem;
        position: relative;
    }

    .title {
        font-size: 16px;
    }

    .message {
        color: #626262;
        font-size: 12px;
        line-height: 1.2rem;
        word-wrap: anywhere;
    }

    ul {
        list-style-type: none;
    }

    .button {
        position: absolute;
        right: 20px;
    }
</style>
