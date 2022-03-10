<script setup lang="ts">
import type { PropType } from "vue";
import { truncate } from "@/utils";
import type { HistoryItem } from "@/types";

defineProps({
    item: {
        type: Object as PropType<HistoryItem>,
        required: true,
    },
});

defineEmits(["pause", "cancel", "resume", "remove"]);
</script>

<template>
    <div class="px-0.5 py-1.5">
        <div
            class="h-20 py-2 px-4 w-full flex flex-col bg-white shadow-md rounded-md"
        >
            <div class="flex mb-2 text-sm">
                <span> {{ truncate(item.filename, 15) }} </span>
                <div class="ml-auto">
                    <button
                        v-if="item.status === 'in-progress'"
                        :disabled="item.type === 'in'"
                        class="mx-0.5 px-1 rounded-sm bg-yellow-500 text-white text-xs disabled:opacity-75"
                        @click="$emit('pause')"
                    >
                        pause
                    </button>

                    <template v-if="item.status === 'paused'">
                        <button
                            class="mx-0.5 px-1.5 rounded-sm bg-orange-500 text-white text-xs disabled:opacity-75"
                            :disabled="item.type === 'in'"
                            @click="$emit('cancel')"
                        >
                            cancel
                        </button>
                        <button
                            class="mx-0.5 px-1.5 rounded-sm bg-green-600 text-white text-xs disabled:opacity-75"
                            :disabled="item.type === 'in'"
                            @click="$emit('resume')"
                        >
                            resume
                        </button>
                    </template>

                    <button
                        v-if="
                            item.status === 'canceled' ||
                            item.status === 'completed'
                        "
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
                    class="absolute w-full h-full bg-blue-500 transform origin-left rounded-2xl scale-x-50"
                    :style="{
                        'transform': `scaleX(${item.progress})`,
                    }"
                ></div>
            </div>

            <div class="flex">
                <span class="mr-auto w-6"> </span>
                <span class="mt-1 text-xs text-center">
                    {{ (item.progress * 100).toFixed(2) }}
                </span>
                <span class="ml-auto text-center w-6">
                    {{ item.type === "out" ? "->" : "<-" }}
                </span>
            </div>
        </div>
    </div>
</template>
