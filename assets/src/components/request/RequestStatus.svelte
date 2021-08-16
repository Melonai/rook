<script lang="ts">
    import {
        initializeRequest,
        OwnRequestState,
    } from "../../models/own_request";
    import { startRequestConnection } from "../../network/channel/request_connection";
    import DataView from "../DataView.svelte";

    const request = initializeRequest();
    const state = request.state;

    startRequestConnection(request);
</script>

<!-- TODO: Bind states of same path together -->
{#if $state === OwnRequestState.PENDING || $state === OwnRequestState.ACKNOWLEDGED}
    <h1>Waiting for a response...</h1>
    <p>
        {#if $state === OwnRequestState.ACKNOWLEDGED}
            Connecting to signaling server...
        {:else}
            The share’s content will become available to you once the sharer
            decides to accept your request.
        {/if}
    </p>
{:else if $state === OwnRequestState.IN_FLIGHT || $state === OwnRequestState.DONE}
    <h1>Your request was <b>accepted!</b></h1>
    {#if $state === OwnRequestState.IN_FLIGHT}
        Transferring...
    {:else}
        <p>Congratulations! You can access the received data below:</p>
        <DataView />
    {/if}
{:else if $state === OwnRequestState.DECLINED}
    <h1>Your request was <b>declined!</b></h1>
    <p>Sorry! I hope we can still be friends?</p>
{:else}
    <!-- TODO: Handle specific errors -->
    <h1>Eek!</h1>
    <p>An error occured during your request.</p>
{/if}
