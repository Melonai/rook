<script lang="ts">
    import { derived } from "svelte/store";
    import type { Readable } from "svelte/store";
    import type { IncomingRequest } from "../../models/incoming_request";
    import { getShareState, Sharing } from "../../state/share";
    import Request from "./Request.svelte";
    import EmptyRequests from "./EmptyRequests.svelte";

    const sharing = getShareState().state as Sharing;
    const requestMap = sharing.getRequests();

    function requestSorter(a: IncomingRequest, b: IncomingRequest): number {
        return a.info.receivedAt.getTime() - b.info.receivedAt.getTime();
    }

    const requests: Readable<IncomingRequest[]> = derived(requestMap, $map => {
        return Object.values($map).sort(requestSorter);
    });
</script>

{#each $requests as request (request.info.token)}
    <Request {request} />
{:else}
    <EmptyRequests />
{/each}
