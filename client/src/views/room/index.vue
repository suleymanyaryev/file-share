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
    let count = 0;
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
        while (count < length) {
            if (dc!.bufferedAmount > maxBufferedAmount) {
                dc!.addEventListener("bufferedamountlow", lowThresholdHandler);
                return;
            }
            const begin = count * maxMessageSize;
            const end = begin + maxMessageSize;
            const chunk = await file.slice(begin, end).arrayBuffer();
            dc!.send(chunk);
            count++;
        }
        dc!.send(
            JSON.stringify({
                type: "complete-sending",
            })
        );
    }

    queueHandler();
}

let count = 0;
const progress = ref("");
let blob: Blob | null = null;
let meta: { name: string; type: string; size: number; length: number } | null =
    null;

function receiveFile(e: MessageEvent<string | ArrayBuffer>) {
    if (typeof e.data === "string") {
        const data = JSON.parse(e.data);
        if (data.type === "start-sending") {
            isReceiving.value = true;
            progress.value = "";
            count = 0;
            blob = new Blob();
            meta = data.payload;
        }
        if (data.type === "complete-sending") {
            saveAs(blob!, meta!.name);
            isReceiving.value = false;
            progress.value = "";
            count = 0;
            blob = null;
            meta = null;
        }
    }

    if (e.data instanceof ArrayBuffer) {
        count++;
        progress.value = ((count / meta!.length) * 100).toFixed(2);
        blob = new Blob([blob!, e.data], {
            type: meta!.type,
        });
    }
}
</script>

<template>
    <div class="h-screen flex flex-col items-center p-5 w-full bg-blue-200">
        <h1 class="text-2xl mb-5">
            {{ isConnected ? "Connected" : "Disconnected" }}
        </h1>

        {{ progress }}

        <BaseFileInput @new-file="onNewFile" />
    </div>
</template>
