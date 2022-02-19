<script lang="ts">
    import { DataType } from "../../../models/data_type";

    export let type: DataType;

    export let setType: (type: DataType) => void;

    function setText() {
        setType(DataType.TEXT);
    }

    function setFiles() {
        setType(DataType.FILES);
    }
</script>

<div>
    <span class:selected={type === DataType.TEXT} on:click={setText}>
        Text
    </span>
    <span class="splitter">|</span>
    <span class:selected={type === DataType.FILES} on:click={setFiles}>
        Files
    </span>
</div>

<style>
    div {
        margin-bottom: 20px;
    }

    span {
        font-size: 16px;
        color: #626262;
        cursor: pointer;
    }

    .splitter {
        padding: 0 20px;
        cursor: default;
        user-select: none;
    }

    .selected {
        color: white;
    }
</style>
