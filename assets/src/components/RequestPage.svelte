<script lang="ts">
    import Header from "./Header.svelte";
    import RequestStatus from "./request/RequestStatus.svelte";
    import Toasts from "./Toasts.svelte";
</script>

<Header color="white" />
<Toasts />
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

        .data-view {
            border: solid 1px #cccccc;
        }

        .toast {
            color: black;
            background-color: white;
            border: solid 1px #cccccc;
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
