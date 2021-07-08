<script lang="ts">
    import Header from "./Header.svelte";
    import RequestStatus from "./request/RequestStatus.svelte";
</script>

<Header color="white" />

<main>
    <div class="left-segment">
        <RequestStatus />
    </div>
    <div class="right-segment" />
</main>

<svelte:head>
    <style>
        html,
        body {
            background-color: white;
            color: black;
        }
    </style>
</svelte:head>

<style>
    .left-segment {
        flex-shrink: 0;
    }

    .right-segment {
        flex-shrink: 1;
    }
</style>
