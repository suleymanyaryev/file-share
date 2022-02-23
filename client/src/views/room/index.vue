<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { servers } from "../../utils/constants";

const route = useRoute();
const roomId = route.params.roomId;
const isConnected = ref(false);

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

function onRemoteIceCandidate(data) {
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

function onRemoteAnswer(data) {
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
    dc = pc.createDataChannel("file-share");
    dc.binaryType = "arraybuffer";

    dc.onopen = () => {
        console.log("local dc opened");
        dc.send("ping");
    };

    dc.onmessage = async (e) => {
        console.log(`local dc message: ${e.data}`);

        setTimeout(() => {
            dc.send("ping");
        }, 1000);
    };

    dc.onerror = (e) => {
        console.log("local dc error");
        console.log(e);
    };

    dc.onclose = () => {
        console.log("local dc closed");
        pc.close();
    };
}

function onRemoteDataChannel(e: RTCDataChannelEvent) {
    dc = e.channel;
    dc.binaryType = "arraybuffer";

    dc.onopen = () => {
        console.log("remote dc opened");
    };

    dc.onmessage = async (e) => {
        console.log(`remote dc message: ${e.data}`);

        setTimeout(() => {
            dc.send("pong");
        }, 1000);
    };

    dc.onerror = (e) => {
        console.log("remote dc error");
        console.log(e);
    };

    dc.onclose = () => {
        console.log("remote dc close");
        pc.close();
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
</script>

<template>
    <div class="h-screen w-full flex items-center justify-center">
        <h1 class="text-4xl">
            {{ isConnected ? "Connected" : "Disconnected" }}
        </h1>
    </div>
</template>
