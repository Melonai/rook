<script lang="ts">
    import data from "../stores/data";
    import Header from "./Header.svelte";
    import Info from "./share/Info.svelte";
    import Requests from "./share/Requests.svelte";
</script>

<Header color="black" />

<main>
    <Info />
    <div class="request-list">
        {#if $data.locked}
            <h1>Requests</h1>
            <Requests />
        {/if}
    </div>
</main>

<svelte:head>
    <style>
        html,
        body {
            background-color: black;
        }
    </style>
</svelte:head>

<style>
    main {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 100%;
        width: 66%;
        margin: auto;
        flex-wrap: wrap;
    }

    h1 {
        font-size: 35px;
        color: white;
        font-weight: 400;
    }

    .request-list {
        width: 315px;
        height: 100%;
        padding-top: 225px;
        box-sizing: border-box;
    }
</style>
