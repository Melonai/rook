<script lang="ts">
    import { getRequestState, RequestStateType } from "../../state/request";
    import DataView from "../DataView.svelte";

    const state = getRequestState().type;
</script>

<!-- TODO: Bind states of same path together -->
{#if $state === RequestStateType.CONNECTING || $state === RequestStateType.WAITING_FOR_RESPONSE}
    <h1>Waiting for a response...</h1>
    <p>
        {#if $state === RequestStateType.CONNECTING}
            Connecting to signaling server...
        {:else}
            The share's content will become available to you once the sharer
            decides to accept your request.
        {/if}
    </p>
{:else if $state === RequestStateType.IN_FLIGHT || $state === RequestStateType.DONE}
    <h1>Your request was <b>accepted!</b></h1>
    {#if $state === RequestStateType.IN_FLIGHT}
        Transferring...
    {:else}
        <p>Congratulations! You can access the received data below:</p>
        <DataView showCopyButton={true} />
    {/if}
{:else if $state === RequestStateType.DECLINED}
    <h1>Your request was <b>declined!</b></h1>
    <p>Sorry! I hope we can still be friends?</p>
{:else}
    <!-- TODO: Handle specific errors -->
    <h1>Eek!</h1>
    <p>An error occured during your request.</p>
{/if}
