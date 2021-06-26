<script lang="ts">
    import { start } from "../network/channel/connection";
    import { startRequest } from "../network/channel/request";

    import Header from "./Header.svelte";

    start().then(startRequest);
</script>

<Header color="white" />

<main>
    <div class="left-segment">
        <h1>Waiting for a response...</h1>
        <p>
            The share’s content will become available to you once the sharer
            decides to accept your request.
        </p>
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
