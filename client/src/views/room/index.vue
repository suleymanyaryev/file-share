<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const roomId = route.params.roomId;
console.log(roomId);
</script>

<template>
    <div></div>
</template>
