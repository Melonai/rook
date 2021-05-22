<script lang="ts">
    import { getToken, joinRequestChannel } from "../network/socket";
    import getShareToken from "../utils/getShareToken";

    const startConnection = async () => {
        const token = await getToken();
        joinRequestChannel(token, getShareToken());
    };

    startConnection();
</script>

<main>
    <h1>Requesting</h1>
</main>

<style>
    h1 {
        font-size: 4em;
    }
</style>
