<script lang="ts">
export default {
    name: "BaseFileInput",
};
</script>

<script setup lang="ts">
const emit = defineEmits(["new-file"]);

function onChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = [...Array.from(target.files || [])];
    if (files.length === 0) {
        return;
    }
    emit("new-file", files[0]);
    target.value = "";
}
</script>
8

<template>
    <div
        class="relative max-w-100 w-full h-60 flex items-center justify-center rounded-xl border-2 border-white border-dashed cursor-pointer"
    >
        <input
            type="file"
            class="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
            @change="onChange"
        />

        <div class="text-center text-2xl text-white">
            Browse or <br />
            Drag&Drop files here
        </div>
    </div>
</template>
