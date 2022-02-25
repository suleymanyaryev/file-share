<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { servers } from "../../utils/constants";
import BaseFileInput from "@/components/base/FileInput.vue";
import { saveAs } from "file-saver";

const route = useRoute();
const roomId = route.params.roomId;
const isConnected = ref(false);
const isSending = ref(false);
const isReceiving = ref(false);
const url = window.location.href;
const history = ref<any[]>([]);

const ws = new WebSocket(`ws://127.0.0.1:5000/api/v1/room/${roomId}`);
let pc: RTCPeerConnection | null = null;
let dc: RTCDataChannel | null = null;

ws.onopen = () => {
    console.log("WS open");
    ws.send(
        JSON.stringify({
            type: "client-connected",
        })
    );
};

ws.onerror = () => {
    console.log("WS error");
};

ws.onclose = () => {
    console.log("WS close");
};

ws.onmessage = (event) => {
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

function onConnectionStateChange(e: Event) {
    const target = e.target as RTCPeerConnection;
    if (target !== pc) {
        return;
    }

    if (target.connectionState === "connected") {
        isConnected.value = true;
    }

    if (
        target.connectionState === "disconnected" ||
        target.connectionState === "failed"
    ) {
        isConnected.value = false;
    }
}

function onRemoteIceCandidate(data: any) {
    if (!pc) {
        return;
    }
    pc.addIceCandidate(new RTCIceCandidate(data.iceCandidate));
}

function onLocalIceCandidate(e: RTCPeerConnectionIceEvent) {
    if (e.candidate) {
        ws.send(
            JSON.stringify({
                type: "client-ice-candidate",
                payload: {
                    iceCandidate: e.candidate,
                },
            })
        );
    }
}

function onRemoteAnswer(data: any) {
    if (!pc) {
        return;
    }
    pc.setRemoteDescription(new RTCSessionDescription(data.answer));
}

async function initConnection() {
    pc = new RTCPeerConnection(servers);

    onLocalDataChannel();

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    ws.send(
        JSON.stringify({
            type: "client-offer",
            payload: {
                offer,
            },
        })
    );

    pc.onicecandidate = onLocalIceCandidate;
    pc.onconnectionstatechange = onConnectionStateChange;
}

async function onLocalDataChannel() {
    dc = pc!.createDataChannel("file-share");
    dc.binaryType = "arraybuffer";

    dc.onopen = () => {
        console.log("local dc opened");
    };

    dc.onmessage = async (e: MessageEvent<string | ArrayBuffer>) => {
        receiveFile(e);
    };

    dc.onerror = (e) => {
        console.log("local dc error");
        console.log(e);
    };

    dc.onclose = () => {
        console.log("local dc closed");
        pc!.close();
    };
}

function onRemoteDataChannel(e: RTCDataChannelEvent) {
    dc = e.channel;
    dc.binaryType = "arraybuffer";

    dc.onopen = () => {
        console.log("remote dc opened");
    };

    dc.onmessage = async (e: MessageEvent<string | ArrayBuffer>) => {
        receiveFile(e);
    };

    dc.onerror = (e) => {
        console.log("remote dc error");
        console.log(e);
    };

    dc.onclose = () => {
        console.log("remote dc close");
        pc!.close();
    };
}

async function onRemoteOffer({ offer }) {
    pc = new RTCPeerConnection(servers);

    pc.ondatachannel = onRemoteDataChannel;

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    ws.send(
        JSON.stringify({
            type: "client-answer",
            payload: {
                answer,
            },
        })
    );

    pc.onicecandidate = onLocalIceCandidate;
    pc.onconnectionstatechange = onConnectionStateChange;
}

function onNewFile(file: File) {
    if (!isConnected.value) {
        return;
    }
    if (isSending.value) {
        return;
    }

    sendFile(file);
}

function sendFile(file: File) {
    const name = file.name;
    const type = file.type;
    const size = file.size;

    let maxMessageSize = 64 * 1024;
    let length =
        Math.trunc(size / maxMessageSize) +
        (size % maxMessageSize !== 0 ? 1 : 0);

    let maxBufferedAmount = 12 * 1024 * 1024;

    history.value.push({
        type: "out",
        filename: name,
        filetype: type,
        filesize: size,
        length: length,
        count: 0,
        progress: "0.00",
    });

    const current = history.value[history.value.length - 1];

    dc!.bufferedAmountLowThreshold = Math.trunc(maxBufferedAmount / 8);

    dc!.send(
        JSON.stringify({
            type: "start-sending",
            payload: {
                name,
                type,
                size,
                length,
            },
        })
    );

    function lowThresholdHandler() {
        dc!.removeEventListener("bufferedamountlow", lowThresholdHandler);
        queueHandler();
    }

    async function queueHandler() {
        while (current.count < length) {
            if (dc!.bufferedAmount > maxBufferedAmount) {
                dc!.addEventListener("bufferedamountlow", lowThresholdHandler);
                return;
            }
            const begin = current.count * maxMessageSize;
            const end = begin + maxMessageSize;
            const chunk = await file.slice(begin, end).arrayBuffer();
            dc!.send(chunk);
            current.count++;
            current.progress = current.count / current.length;
        }
        dc!.send(
            JSON.stringify({
                type: "complete-sending",
            })
        );
        isSending.value = false;
    }

    queueHandler();
}

let receiveIndex = -1;
let receiveBlob: Blob | null = null;

function receiveFile(e: MessageEvent<string | ArrayBuffer>) {
    if (typeof e.data === "string") {
        const data = JSON.parse(e.data);
        if (data.type === "start-sending") {
            if (isReceiving.value) {
                return;
            }
            isReceiving.value = true;
            history.value.push({
                type: "in",
                filename: data.payload.name,
                filetype: data.payload.type,
                filesize: data.payload.size,
                length: data.payload.length,
                count: 0,
                progress: "0.00",
            });
            receiveIndex = history.value.length - 1;
            receiveBlob = new Blob();
        }
        if (data.type === "complete-sending") {
            const current = history.value[receiveIndex];
            saveAs(receiveBlob!, current.filename);
            isReceiving.value = false;
            receiveIndex = -1;
            receiveBlob = null;
        }
    }

    if (e.data instanceof ArrayBuffer) {
        const current = history.value[receiveIndex];
        current.count++;
        current.progress = current.count / current.length;
        // current.progress = ((current.count / current.length) * 100).toFixed(2);
        receiveBlob = new Blob([receiveBlob!, e.data], {
            type: current!.type,
        });
    }
}
</script>

<template>
    <div class="h-screen flex flex-col items-center p-5 w-full bg-blue-200">
        <template v-if="isConnected">
            <BaseFileInput @new-file="onNewFile" />
            <div class="w-100 mt-5 bg-gray-100 p-2 rounded-xl">
                <div class="p-1 max-h-100 overflow-y-auto scroll-hidden">
                    <div
                        v-for="(item, index) in history"
                        :key="index"
                        class="px-0.5 py-1.5"
                    >
                        <div
                            class="h-20 py-2 px-4 w-full flex flex-col bg-white shadow-md rounded-md"
                        >
                            <div class="flex mb-2">
                                <span> {{ item.filename }} </span>
                                <span class="ml-auto">
                                    {{ item.type === "out" ? "->" : "<-" }}
                                </span>
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

                            <span class="mt-1 text-xs text-center">
                                {{ (item.progress * 100).toFixed(2) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <h1 v-else class="text-center my-auto text-2xl">
            Share this link <br />
            {{ url }}
        </h1>
    </div>
</template>
