<script lang="ts">
    import { start, Type } from "../network/channel/connection";

    // TODO: Switch to store-based state updates.

    start(Type.REQUEST);
</script>

<main>
    <h1>Requesting</h1>
</main>

<style>
    h1 {
        font-size: 4em;
    }
</style>
