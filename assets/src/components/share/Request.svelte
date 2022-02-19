<script lang="ts">
    import { IncomingRequestState } from "../../models/incoming_request";
    import type { IncomingRequest } from "../../models/incoming_request";
    import CheckIcon from "../icons/CheckIcon.svelte";
    import CloseIcon from "../icons/CloseIcon.svelte";
    import { getShareState, Sharing } from "../../state/share";

    export let request: IncomingRequest;
    const state = request.state;

    const time = request.info.receivedAt.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
    });

    async function accept() {
        const sharing = getShareState().state as Sharing;
        sharing.acceptRequest(request);
    }

    function decline() {
        const sharing = getShareState().state as Sharing;
        sharing.declineRequest(request);
    }
</script>

<!-- TODO: Replace placeholder values and show IP instead of token. -->
<ul class="request">
    {#if $state === IncomingRequestState.WAITING}
        <div class="buttons">
            <div class="round-button" on:click={accept}>
                <CheckIcon color="white" />
            </div>
            <div class="plain-button" on:click={decline}>
                <CloseIcon color="black" />
            </div>
        </div>
    {/if}

    <li>Requested at {time}</li>
    <li class="ip">{request.info.ip}</li>
    <li>{request.info.location}</li>
    <li>{request.info.client}</li>

    {#if $state === IncomingRequestState.IN_FLIGHT}
        Transferring...
    {:else if $state === IncomingRequestState.DONE}
        Done!
    {:else if $state === IncomingRequestState.DECLINED}
        Declined.
    {/if}
</ul>

<style>
    .request {
        background-color: white;
        color: #626262;
        padding: 17px 20px;
        font-size: 12px;
        line-height: 1.5rem;
        position: relative;
    }

    ul {
        list-style-type: none;
    }

    .ip {
        line-height: 1.75rem;
        font-size: 16px;
        color: black;
    }

    .buttons {
        position: absolute;
        right: 20px;
        display: flex;
        justify-content: space-between;
        width: 50px;
        align-items: center;
    }

    .round-button {
        width: 24px;
        height: 24px;
        border-radius: 100%;
        background-color: black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .plain-button {
        display: flex;
        align-items: center;
    }
</style>
