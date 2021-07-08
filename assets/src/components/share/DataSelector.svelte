<script lang="ts">
    import { startShareConnection } from "../../network/channel/share_connection";

    import data from "../../stores/data";

    let value = "";

    const submit = () => {
        data.set(value);
        startShareConnection();
    };

    // TODO: Accept data other than text.
</script>

<form on:submit|preventDefault={submit}>
    <!-- TODO: Prettier input field -->
    <input type="text" bind:value />
    <input class="set-data-button" type="submit" value="Share" />
</form>

<style>
    form {
        display: flex;
        flex-wrap: nowrap;
    }

    input {
        border: none;
        font-size: 14px;
        color: black;
        background-color: white;
        padding: 10px 20px;
        box-sizing: border-box;
    }

    .set-data-button {
        margin-left: 0.5rem;
    }
</style>
