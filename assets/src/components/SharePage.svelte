<script lang="ts">
    import data from "../stores/data";
    import Header from "./Header.svelte";
    import Info from "./share/Info.svelte";
    import Requests from "./share/Requests.svelte";
</script>

<Header color="black" />

<main>
    <div class="left-segment">
        <Info />
    </div>
    <div class="right-segment">
        {#if $data.locked}
            <h1>Requests</h1>
            <Requests />
        {/if}
    </div>
</main>

<svelte:head>
    <style>
        html,
        body {
            background-color: black;
            color: white;
        }
    </style>
</svelte:head>
