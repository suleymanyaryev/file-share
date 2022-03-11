<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import BaseFileInput from "@/components/base/FileInput.vue";
import ItemInProcess from "@/components/ItemInProcess.vue";
import ItemInQueue from "@/components/ItemInQueue.vue";
import useGlob from "@/composables/glob";
import useSend from "@/composables/send";
import useReceive from "@/composables/receive";
import useCommon from "@/composables/common";
import useLocalPeer from "@/composables/local-peer";
import useRemotePeer from "@/composables/remote-peer";
import copy from "copy-to-clipboard";

const route = useRoute();
const roomId = route.params.roomId;
const url = window.location.href;
const glob = useGlob(`ws://127.0.0.1:5000/api/v1/room/${roomId}`);

const { sendFile, pauseSending, resumeSending, cancelSending } = useSend(glob);
const { receiveFile } = useReceive(glob);
const { onConnectionStateChange, onLocalIceCandidate } = useCommon(glob);
const { initConnection } = useLocalPeer(
    glob,
    receiveFile,
    onConnectionStateChange,
    onLocalIceCandidate
);
const { onRemoteAnswer, onRemoteIceCandidate, onRemoteOffer } = useRemotePeer(
    glob,
    receiveFile,
    onConnectionStateChange,
    onLocalIceCandidate
);

glob.ws.onopen = () => {
    console.log("WS open");
    glob.ws.send(
        JSON.stringify({
            type: "client-connected",
        })
    );
};

glob.ws.onerror = () => {
    console.log("WS error");
};

glob.ws.onclose = () => {
    console.log("WS close");
};

glob.ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "client-connected") {
        initConnection();
    }

    if (data.type === "client-answer") {
        onRemoteAnswer(data.payload);
    }

    if (data.type === "client-offer") {
        onRemoteOffer(data.payload);
    }

    if (data.type === "client-ice-candidate") {
        onRemoteIceCandidate(data.payload);
    }
};

const { history, queue, isConnected } = glob;

function onPause(index: number) {
    if (history.value[index].type === "out") {
        pauseSending(index);
    }
}

function onResume(index: number) {
    if (history.value[index].type === "out") {
        resumeSending(index);
    }
}

function onCancel(index: number) {
    if (history.value[index].type === "out") {
        cancelSending(index);
    }
}

const isCopied = ref(false);
function copyToClipboard() {
    copy(url);
    isCopied.value = true;
    setTimeout(() => {
        isCopied.value = false;
    }, 1500);
}
</script>

<template>
    <div class="h-screen flex flex-col items-center p-5 w-full bg-blue-200">
        <template v-if="isConnected">
            <BaseFileInput @new-file="sendFile" />
            <div
                v-if="history.length > 0 || queue.length > 0"
                class="max-w-100 w-full mt-5 bg-gray-100 p-2 rounded-xl"
            >
                <div class="p-1 max-h-100 overflow-y-auto scroll-hidden">
                    <ItemInProcess
                        v-for="(item, index) in history"
                        :key="index"
                        :item="item"
                        @pause="onPause(index)"
                        @resume="onResume(index)"
                        @cancel="onCancel(index)"
                        @remove="history.splice(index, 1)"
                    />

                    <ItemInQueue
                        v-for="(item, index) in queue"
                        :key="index"
                        :item="item"
                        @remove="queue.splice(index, 1)"
                    />
                </div>
            </div>
        </template>
        <h1 v-else class="text-center my-auto text-2xl relative">
            Copy and Share this link <br />
            <span class="text-blue-800 cursor-pointer" @click="copyToClipboard">
                {{ url }}
            </span>

            <Transition
                enter-active-class="transition-opacity duration-150"
                leave-active-class="transition-opacity duration-150"
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
            >
                <span
                    v-if="isCopied"
                    class="absolute left-1/2 top-full transform -translate-x-1/2 translate-y-2 text-base text-green-600 select-none"
                >
                    Copied!
                </span>
            </Transition>
        </h1>
    </div>
</template>
