<script lang="ts">
    import RookIcon from "./icons/RookIcon.svelte";

    export let color: "white" | "black";
</script>

<header>
    <RookIcon color={color === "black" ? "white" : "black"} />
</header>

<style>
    header {
        padding: 5rem;
        box-sizing: border-box;
        position: absolute;
        width: 100%;
    }
</style>
