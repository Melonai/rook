<script lang="ts">
    import requests from "../../stores/received_requests";
    import Request from "./Request.svelte";
</script>

{#each $requests as request (request.info.token)}
    <Request {request} />
{/each}
