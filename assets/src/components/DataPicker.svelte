<script lang="ts">
    import data from "../stores/data";

    let value = "";

    const submit = () => {
        data.set(value);
    };
</script>

<form on:submit|preventDefault={submit}>
    <input type="text" bind:value />
    <input type="submit" value="Submit" />
</form>
