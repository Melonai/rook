<script lang="ts">
    import { offer } from "../../network/transfer/share";
    import CheckIcon from "../icons/CheckIcon.svelte";
    import CloseIcon from "../icons/CloseIcon.svelte";

    export let token: string;

    async function accept() {
        const transfer = await offer(token);
    }

    function decline() {}
</script>

<!-- TODO: Replace placeholder values and show IP instead of token. -->
<ul class="request">
    <div class="buttons">
        <div class="round-button" on:click={accept}>
            <CheckIcon color="white" />
        </div>
        <div class="plain-button" on:click={decline}>
            <CloseIcon color="black" />
        </div>
    </div>
    <li>Requested at 14:38</li>
    <li class="ip">{token}</li>
    <li>Trusowo, Russia</li>
    <li>Firefox 89</li>
</ul>

<style>
    .request {
        background-color: white;
        color: #626262;
        padding: 17px 20px;
        font-size: 12px;
        line-height: 1.5rem;
        position: relative;
    }

    ul {
        list-style-type: none;
    }

    .ip {
        line-height: 1.75rem;
        font-size: 16px;
        color: black;
    }

    .buttons {
        position: absolute;
        right: 20px;
        display: flex;
        justify-content: space-between;
        width: 50px;
        align-items: center;
    }

    .round-button {
        width: 24px;
        height: 24px;
        border-radius: 100%;
        background-color: black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .plain-button {
        display: flex;
        align-items: center;
    }
</style>
