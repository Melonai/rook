<script lang="ts">
    import { offer } from "../../network/transfer/transfer";

    export let token: string;

    async function accept() {
        const transfer = await offer(token);
    }

    function decline() {}
</script>

<div class="container">
    <span>{token}</span>
    <div class="buttons">
        <button on:click={accept}>Accept</button>
        <button on:click={decline}>X</button>
    </div>
</div>

<style>
    .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .buttons {
        display: flex;
    }
</style>
