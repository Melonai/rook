<script lang="ts">
    import RookIcon from "./icons/RookIcon.svelte";

    export let color: "white" | "black";
</script>

<header>
    <RookIcon color={color === "black" ? "white" : "black"} />
</header>

<style>
    header {
        position: absolute;
        display: flex;
        padding: 4rem 4rem 3rem;
        box-sizing: border-box;
        width: 100%;
    }
</style>
