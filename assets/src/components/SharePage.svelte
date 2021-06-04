<script lang="ts">
    import data from "../stores/data";
    import DataPicker from "./share/DataPicker.svelte";
    import IncomingRequests from "./share/Requests.svelte";
</script>

<main>
    <h1>Sharing</h1>
    {#if !$data.locked}
        <DataPicker />
    {:else}
        <IncomingRequests />
    {/if}
</main>

<style>
    h1 {
        font-size: 4em;
    }
</style>
