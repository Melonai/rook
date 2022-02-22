<script lang="ts">
    import Header from "./Header.svelte";
    import ShareStatus from "./share/ShareStatus.svelte";
    import RequestList from "./share/RequestList.svelte";
    import { getShareState, ShareStateType } from "../state/share";
    import Toasts from "./Toasts.svelte";

    const state = getShareState().type;
</script>

<Header color="black" />
<Toasts />
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
            border: solid 1px #626262;
        }

        .toast {
            color: white;
            background-color: black;
            border: solid 1px #626262;
        }
    </style>
</svelte:head>

<style>
    .right-segment {
        height: 100%;
        margin-top: 15rem;
    }

    @media (max-width: 850px) {
        .right-segment {
            margin-top: 0;
        }
    }
</style>
