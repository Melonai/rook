<script lang="ts">
    import { start } from "../network/channel/connection";
    import { startRequest } from "../network/channel/request";

    // TODO: Switch to store-based state updates.

    start().then(startRequest);
</script>

<main>
    <h1>Requesting</h1>
</main>

<style>
    h1 {
        font-size: 4em;
    }
</style>
