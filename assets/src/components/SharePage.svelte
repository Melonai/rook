<script lang="ts">
    import Header from "./Header.svelte";
    import ShareStatus from "./share/ShareStatus.svelte";
    import RequestList from "./share/RequestList.svelte";
    import { getShareState, ShareStateType } from "../state/share";

    const state = getShareState().type;
</script>

<Header color="black" />

<main>
    <div class="left-segment">
        <ShareStatus />
    </div>
    <div class="right-segment">
        {#if $state === ShareStateType.SHARING}
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

        .data-view {
            background-color: white;
            color: black;
        }
    </style>
</svelte:head>
