<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const roomId = Math.random().toString(36).slice(2);

router.push({
    name: "room-view",
    params: {
        roomId,
    },
});
</script>

<template>
    <div></div>
</template>
