<script lang="ts">
    import data from "../stores/data";
    import Header from "./Header.svelte";
    import ShareStatus from "./share/ShareStatus.svelte";
    import RequestList from "./share/RequestList.svelte";
</script>

<Header color="black" />

<main>
    <div class="left-segment">
        <ShareStatus />
    </div>
    <div class="right-segment">
        {#if $data.locked}
            <h1>Requests</h1>
            <RequestList />
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
