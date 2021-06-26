<script lang="ts">
    import requests from "../../stores/requests";
    import Request from "./Request.svelte";
</script>

{#each $requests as request}
    <Request token={request} />
{/each}