<script lang="ts">
    import { start } from "../../network/channel/connection";
    import { startShare } from "../../network/channel/share";

    import data from "../../stores/data";

    let value = "";

    const submit = () => {
        data.set(value);
        start().then(startShare);
    };

    // TODO: Accept data other than text.
</script>

<form on:submit|preventDefault={submit}>
    <input type="text" bind:value />
    <input type="submit" value="Submit" />
</form>
