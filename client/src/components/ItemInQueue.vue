<script lang="ts" setup>
import { truncate } from "@/utils";

defineProps({
    item: {
        type: Object,
        required: true,
    },
});

defineEmits(["remove"]);
</script>

<template>
    <div class="px-0.5 py-1.5">
        <div
            class="h-20 py-2 px-4 w-full flex flex-col bg-white shadow-md rounded-md"
        >
            <div class="flex mb-2 text-sm">
                <span> {{ truncate(item.name, 15) }} </span>

                <div class="ml-auto">
                    <button
                        class="mx-0.5 px-1.5 rounded-sm bg-red-500 text-white text-xs"
                        @click="$emit('remove')"
                    >
                        remove
                    </button>
                </div>
            </div>

            <div
                class="relative h-1.5 w-full bg-gray-300 rounded-2xl overflow-hidden"
            >
                <div
                    class="absolute w-full h-full bg-blue-500 transform origin-left rounded-2xl scale-x-0"
                ></div>
            </div>

            <div class="flex">
                <span class="mr-auto w-6"> </span>
                <span class="mt-1 text-xs text-center"> pending </span>
                <span class="ml-auto text-center w-6"> -> </span>
            </div>
        </div>
    </div>
</template>
