<script lang="ts">
    import ZzzIcon from "../icons/ZzzIcon.svelte";
</script>

<ul class="empty-request first">
    <li class="icon"><ZzzIcon color="white" /></li>
    <li class="empty-message-title">No requests yet!</li>
    <li class="empty-message-subtitle">We're looking for them though!</li>
</ul>
<ul class="empty-request middle" />
<ul class="empty-request last" />

<style>
    .empty-request {
        padding: 0 20px;
        line-height: 1.5rem;
        position: relative;
        height: 140px;

        display: flex;
        flex-direction: column;
        justify-content: center;

        border: dashed 1px black;
    }

    ul {
        list-style: none;
    }

    .icon {
        animation: icon-floating 3s ease-in-out infinite;
    }

    @keyframes icon-floating {
        0% {
            transform: translateY(0);
        }

        50% {
            transform: translateY(-5px);
        }

        100% {
            transform: translateY(0);
        }
    }

    .empty-message-title {
        font-size: 18px;
        color: white;
    }

    .empty-message-subtitle {
        font-size: 16px;
        color: #626262;
    }

    .first {
        background: linear-gradient(to bottom, black, black) padding-box,
            linear-gradient(to bottom, #626262, #626262) border-box;
    }

    .middle {
        background: linear-gradient(to bottom, black, black) padding-box,
            linear-gradient(to bottom, #626262, #6262627f) border-box;
    }

    .last {
        background: linear-gradient(to bottom, black, black) padding-box,
            linear-gradient(to bottom, #6262627f, #62626200) border-box;
    }
</style>
