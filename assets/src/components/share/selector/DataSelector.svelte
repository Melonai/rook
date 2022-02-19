<script lang="ts">
    import { DataType } from "../../../models/data_type";
    import { ChoosingData, getShareState } from "../../../state/share";
    import ShareIcon from "../../icons/ShareIcon.svelte";
    import DataTypePicker from "./DataTypePicker.svelte";

    let value = "";

    const submit = () => {
        const share = getShareState().state as ChoosingData;
        share.submitData(value);
    };

    let type: DataType = DataType.TEXT;

    function setType(t: DataType) {
        type = t;
        value = "";
    }

    // TODO: Accept data other than text.
</script>

<DataTypePicker {type} {setType} />
{#if type === DataType.TEXT}
    <form on:submit|preventDefault={submit}>
        <!-- TODO: Prettier input field -->
        <input type="text" bind:value />
        <button class="start-sharing-button" type="submit">
            <ShareIcon color="black" />
            Start Sharing
        </button>
    </form>
{:else}
    <p>No file sharing yet!</p>
{/if}

<style>
    input {
        border: none;
        font-size: 14px;
        color: black;
        background-color: white;
        padding: 10px 20px;
        box-sizing: border-box;
    }

    .start-sharing-button {
        border: none;
        font-size: 14px;
        background-color: white;
        color: black;
        padding: 10px 14px;

        display: flex;

        align-items: center;
        gap: 10px;

        margin-top: 20px;
    }
</style>
