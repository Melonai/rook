<script lang="ts">
    export let color: "white" | "black";
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="16"
    height="16"
>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M13 10h7l-9 13v-9H4l9-13z" fill={color} />
</svg>
